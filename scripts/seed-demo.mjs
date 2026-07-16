import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const PASSWORD = "LocBedDemo2026!";

async function createDemoUser(email, role) {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing.users.find((u) => u.email === email);
  let userId;

  if (found) {
    userId = found.id;
    await supabase.auth.admin.updateUserById(userId, { password: PASSWORD });
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: `Démo ${role}` },
    });
    if (error) throw error;
    userId = data.user.id;
  }

  await supabase.from("profiles").update({ role, display_name: `Démo ${role}` }).eq("id", userId);
  console.log(`✔ ${role}: ${email} / ${PASSWORD} (id: ${userId})`);
  return userId;
}

const travelerId = await createDemoUser("voyageur.demo@locbed.com", "voyageur");
const ownerId = await createDemoUser("proprietaire.demo@locbed.com", "proprietaire");
await createDemoUser("admin.demo@locbed.com", "admin");

// Seed a couple of demo listings under the owner account.
const { data: paris } = await supabase.from("cities").select("id, country_id").eq("slug", "paris").single();
const { data: nice } = await supabase.from("cities").select("id, country_id").eq("slug", "nice").single();
const { data: amenities } = await supabase.from("amenities").select("id, code");
const amenityId = (code) => amenities.find((a) => a.code === code)?.id;

const { data: existingListings } = await supabase
  .from("listings")
  .select("id")
  .eq("owner_id", ownerId);

if (!existingListings || existingListings.length === 0) {
  const { data: listing1 } = await supabase
    .from("listings")
    .insert({
      owner_id: ownerId,
      type: "appartement",
      title: "Appartement lumineux au cœur de Paris",
      slug: "appartement-lumineux-paris-demo",
      description:
        "Bel appartement rénové à deux pas des grands monuments. Idéal pour un séjour romantique ou professionnel. Cuisine équipée, wifi fibre, literie de qualité.",
      city_id: paris.id,
      country_id: paris.country_id,
      address: "12 rue de Rivoli",
      latitude: 48.8566,
      longitude: 2.3522,
      max_guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      base_price_per_night: 120,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  await supabase.from("listing_amenities").insert(
    ["wifi", "climatisation", "teletravail"]
      .map((code) => amenityId(code))
      .filter(Boolean)
      .map((amenity_id) => ({ listing_id: listing1.id, amenity_id })),
  );

  const { data: listing2 } = await supabase
    .from("listings")
    .insert({
      owner_id: ownerId,
      type: "maison",
      title: "Villa avec piscine vue mer à Nice",
      slug: "villa-piscine-vue-mer-nice-demo",
      description:
        "Villa spacieuse avec piscine privée et vue imprenable sur la mer. Parfaite pour les familles ou entre amis. Terrasse ensoleillée, barbecue, parking privé.",
      city_id: nice.id,
      country_id: nice.country_id,
      address: "8 avenue des Palmiers",
      latitude: 43.7102,
      longitude: 7.262,
      max_guests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
      base_price_per_night: 350,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  await supabase.from("listing_amenities").insert(
    ["piscine", "wifi", "parking", "vue_mer", "climatisation"]
      .map((code) => amenityId(code))
      .filter(Boolean)
      .map((amenity_id) => ({ listing_id: listing2.id, amenity_id })),
  );

  console.log(`✔ 2 logements de démo créés pour proprietaire.demo@locbed.com`);
} else {
  console.log("Logements de démo déjà présents, rien à créer.");
}

console.log("\nComptes créés :");
console.log("Voyageur   : voyageur.demo@locbed.com / " + PASSWORD);
console.log("Propriétaire : proprietaire.demo@locbed.com / " + PASSWORD);
console.log("Admin      : admin.demo@locbed.com / " + PASSWORD);
