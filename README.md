# LocBed

Plateforme de réservation de logements entre particuliers, sans commission. Les propriétaires paient un abonnement mensuel fixe (9€ HT/mois pour un appartement, 14€ HT/mois pour une maison) ; le paiement du séjour se fait directement entre voyageur et propriétaire.

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Paiements**: Stripe (abonnements propriétaires uniquement)
- **Cartographie**: Mapbox
- **i18n**: next-intl (fr par défaut, en pour démarrer, mécanisme prêt pour 30+ langues)
- **PWA**: Serwist
- **Hébergement**: Vercel (app) + Supabase (backend managé)

## Démarrage local

```bash
npm install
cp .env.example .env.local   # renseigner les variables (voir ci-dessous)
npm run dev
```

### Variables d'environnement

Voir `.env.example`. Les identifiants OAuth Google/Apple/Facebook se configurent dans le Dashboard Supabase (Authentication > Providers), pas via des variables d'env.

### Base de données

Le schéma est versionné dans `supabase/migrations/`. Une fois un projet Supabase lié :

```bash
npx supabase login
npx supabase link --project-ref <ref>
npx supabase db push
npx supabase db execute -f supabase/seed.sql
npm run supabase:types   # régénère src/types/database.types.ts
```

Un hook JWT personnalisé (`public.custom_access_token_hook`, défini dans la dernière migration) doit être activé manuellement dans le Dashboard : **Authentication > Hooks > Customize Access Token (JWT) Claims**.

### Stripe

```bash
npm run stripe:setup   # crée les Products/Prices Stripe et peuple subscription_plans
```

Puis enregistrer l'endpoint webhook (`/api/stripe/webhook`) dans le Dashboard Stripe une fois l'app déployée.

## État du projet

Ce dépôt contient la **Phase 1 — Fondations** : architecture, schéma de base de données complet, authentification par rôles (voyageur/propriétaire/admin), squelette Stripe, design system, PWA, i18n et SEO. Les fonctionnalités métier (messagerie, avis, synchronisation iCal, CMS admin, blog, badges, parrainage, traduction automatique...) sont développées par itérations successives.

## Structure

```
src/
├── app/[locale]/         # routes (marketing, auth, compte, proprietaire, admin)
├── components/           # ui/ (shadcn), layout/, shared/, providers/
├── features/             # modules par fonctionnalité (auth, listings, subscriptions...)
├── lib/                  # clients Supabase/Stripe/Mapbox, helpers SEO
├── i18n/                 # routing, messages
└── types/database.types.ts
supabase/
├── migrations/           # schéma SQL versionné
└── seed.sql              # données de référence (pays, villes, catégories...)
```
