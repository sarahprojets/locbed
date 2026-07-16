-- Reference data. Safe to re-run (idempotent via ON CONFLICT).

insert into public.countries (code, name, slug) values
  ('FR', 'France', 'france'),
  ('ES', 'Espagne', 'espagne'),
  ('IT', 'Italie', 'italie'),
  ('PT', 'Portugal', 'portugal'),
  ('CH', 'Suisse', 'suisse')
on conflict (code) do nothing;

insert into public.cities (country_id, name, slug, latitude, longitude)
select c.id, city.name, city.slug, city.lat, city.lng
from public.countries c
join (values
  ('france', 'Paris', 'paris', 48.8566, 2.3522),
  ('france', 'Nice', 'nice', 43.7102, 7.2620),
  ('france', 'Lyon', 'lyon', 45.7640, 4.8357),
  ('france', 'Bordeaux', 'bordeaux', 44.8378, -0.5792),
  ('france', 'Annecy', 'annecy', 45.8992, 6.1294),
  ('espagne', 'Barcelone', 'barcelone', 41.3874, 2.1686),
  ('italie', 'Rome', 'rome', 41.9028, 12.4964)
) as city(country_slug, name, slug, lat, lng) on city.country_slug = c.slug
on conflict (country_id, slug) do nothing;

insert into public.categories (code, name) values
  ('appartement_ville', 'Appartement en ville'),
  ('maison_campagne', 'Maison à la campagne'),
  ('villa', 'Villa'),
  ('chalet', 'Chalet'),
  ('loft', 'Loft'),
  ('studio', 'Studio')
on conflict (code) do nothing;

insert into public.amenities (code, name) values
  ('piscine', 'Piscine'),
  ('wifi', 'Wi-Fi'),
  ('parking', 'Parking'),
  ('climatisation', 'Climatisation'),
  ('vue_mer', 'Vue mer'),
  ('animaux_acceptes', 'Animaux acceptés'),
  ('petit_dejeuner', 'Petit-déjeuner'),
  ('teletravail', 'Adapté au télétravail'),
  ('accessible_pmr', 'Accessible PMR')
on conflict (code) do nothing;

insert into public.subscription_plans (code, label, amount_cents, currency, trial_days) values
  ('appartement', 'Appartement', 900, 'eur', 30),
  ('maison', 'Maison', 1400, 'eur', 30)
on conflict (code) do nothing;

insert into public.badges (code, name, scope) values
  ('super_proprietaire', 'Super Propriétaire', 'profile'),
  ('voyageur_exemplaire', 'Voyageur Exemplaire', 'profile'),
  ('reponse_rapide', 'Réponse Rapide', 'profile'),
  ('profil_verifie', 'Profil Vérifié', 'profile'),
  ('coup_de_coeur', 'Coup de cœur', 'listing'),
  ('nouveau_logement', 'Nouveau logement', 'listing')
on conflict (code) do nothing;
