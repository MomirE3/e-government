# SSO Autentifikacija za E-Government Platform

## Pregled

Implementiran je Single Sign-On (SSO) sistem za e-government platformu koji omogućava jedinstvenu autentifikaciju za sve mikroservise kroz API Gateway.

## Arhitektura

### Komponente

- **API Gateway** (`e-government`): Centralna tačka za autentifikaciju i autorizaciju
- **MUP Mikroservis**: Upravlja podacima građana i podržava auth operacije
- **Zavod Mikroservis**: Statistički servis sa zaštićenim admin rutama

### Uloge

- **ADMIN**: Puna administracija sistema
- **CITIZEN**: Građani sa ograničenim pristupom svojih podataka

## Implementacija

### 1. Autentifikacija

- JWT tokeni za sesiju
- bcrypt za hash-ovanje lozinki
- Passport strategije (Local i JWT)

### 2. Autorizacija

- Role-based access control (RBAC)
- Guard-ovi za zaštićene rute
- Pojedinačne dozvole po endpointima

### 3. Baza podataka

Dodana polja u `citizens` tabelu:

```sql
ALTER TABLE citizens
ADD COLUMN password TEXT,
ADD COLUMN role UserRole DEFAULT 'CITIZEN',
ADD CONSTRAINT citizens_email_unique UNIQUE (email);
```

## Korišćenje

### Registracija

```javascript
POST /auth/register
{
  "jmbg": "1234567890123",
  "firstName": "Marko",
  "lastName": "Petrović",
  "email": "marko@example.com",
  "phone": "+38161234567",
  "password": "sigurnaSifra123"
}
```

### Login

```javascript
POST /auth/login
{
  "email": "marko@example.com",
  "password": "sigurnaSifra123"
}

// Odgovor:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "citizen_id",
    "jmbg": "1234567890123",
    "firstName": "Marko",
    "lastName": "Petrović",
    "email": "marko@example.com",
    "role": "CITIZEN"
  }
}
```

### Korišćenje tokena

```javascript
GET /mup/citizens/my_id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Bezbednost

### Uloge i dozvole

#### CITIZEN uloga:

- Može videti **samo svoje** podatke
- Može ažurirati **samo svoje** podatke
- Može videti **svoja** prekršaje
- Može videti **svoju** adresu

#### ADMIN uloga:

- Pun pristup svim građanima
- Kreiranje novih građana
- Upravljanje prekršajima
- Kreiranje anketa i izveštaja
- Administracija sistema

### Zaštićene rute

#### MUP servis:

- `GET /mup/citizens` - samo ADMIN
- `GET /mup/citizens/:id` - ADMIN ili vlasnik
- `PUT /mup/citizens/:id` - ADMIN ili vlasnik
- `DELETE /mup/citizens/:id` - samo ADMIN
- `POST /mup/infraction` - samo ADMIN

#### Zavod servis:

- `POST /zavod/surway` - samo ADMIN
- `POST /zavod/reports/*` - samo ADMIN
- `GET /zavod/surway/fill/:token` - javno dostupno

## Environment varijable

```bash
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/mup_gradjani
```

## Pokretanje

1. **Instaliraj dependencies:**

```bash
npm install
```

2. **Pokreni migracije:**

```bash
npm run prisma:migrate-mup
npm run prisma:generate-mup
```

3. **Pokreni servise:**

```bash
# API Gateway
npm run start:dev:gateway

# MUP servis
npm run start:dev:mup

# Zavod servis
npm run start:dev:zavod
```

## Testiranje

Koristi `requests/auth.http` fajl za testiranje autentifikacije i autorizacije.

### Kreiranje admin korisnika

Prvi admin može biti kreiran direktno kroz bazu ili dodavanjem početnog admin naloga u aplikaciju.

### SSO tok

1. Korisnik se registruje/uloguje preko API Gateway-a
2. Gateway izdaje JWT token
3. Token se koristi za pristup svim mikroservisima
4. Svaki mikroservis verifikuje token kroz Gateway
5. Uloge se proveravaju na gateway nivou

## Napomene

- Svi mikroservisi komuniciraju sa Gateway-om za autentifikaciju
- Građani mogu pristupiti samo svojim podacima
- Admin ima pun pristup sistemu
- Javne ankete ne zahtevaju autentifikaciju
- Tokeni istječu nakon 24 sata
