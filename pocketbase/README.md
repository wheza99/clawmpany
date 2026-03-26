# PocketBase Setup

PocketBase adalah backend database yang digunakan untuk menyimpan data aplikasi Clawmpany.

## Struktur Folder

```
pocketbase/
├── Dockerfile           # Docker image untuk PocketBase
├── pb_data/            # Data database (di-ignore oleh git)
├── pb_migrations/      # Migration files untuk schema database
└── README.md          # File ini
```

## Cara Menjalankan

### Development (Tanpa Docker)

1. Download PocketBase dari https://pocketbase.io/docs/
2. Extract dan jalankan:
   ```bash
   ./pocketbase serve --http=0.0.0.0:8090
   ```
3. Buka http://localhost:8090/_/ untuk admin UI

### Development (Dengan Docker)

```bash
# Jalankan hanya PocketBase
docker-compose up pocketbase

# Atau jalankan semua services
docker-compose up
```

### Production

```bash
docker-compose -f docker-compose.yml up -d
```

## Setup Awal

1. Buka Admin UI: http://localhost:8090/_/
2. Buat admin account pertama
3. Buat collections yang diperlukan (lihat schema di bawah)

## Schema Collections

### Collection: `users` (Auto-generated)
PocketBase otomatis membuat collection `users` untuk authentication.

### Collection: `servers`
```json
{
  "name": "text",
  "description": "text",
  "status": "select",
  "ip_address": "text",
  "user": "relation(users)"
}
```

### Collection: `payments`
```json
{
  "amount": "number",
  "status": "select",
  "payment_method": "text",
  "user": "relation(users)",
  "server": "relation(servers)"
}
```

### Collection: `offices`
```json
{
  "name": "text",
  "layout": "json",
  "user": "relation(users)"
}
```

## Environment Variables

Tambahkan di `.env`:
```env
VITE_POCKETBASE_URL=http://localhost:8090
```

## API Endpoints

PocketBase menyediakan REST API otomatis:
- `GET /api/collections/{collection}/records` - List records
- `POST /api/collections/{collection}/records` - Create record
- `GET /api/collections/{collection}/records/{id}` - Get record
- `PATCH /api/collections/{collection}/records/{id}` - Update record
- `DELETE /api/collections/{collection}/records/{id}` - Delete record

Dokumentasi lengkap: https://pocketbase.io/docs/

## Backup & Restore

### Backup
```bash
# Backup manual
cp -r pocketbase/pb_data pocketbase/pb_data_backup_$(date +%Y%m%d)

# Atua via Admin UI > Settings > Backup
```

### Restore
```bash
# Stop PocketBase
# Replace pb_data dengan backup
# Start PocketBase
```

## Migrations

PocketBase otomatis generate migration files di `pb_migrations/` ketika ada perubahan schema via Admin UI.

Jika ingin apply migrations di environment baru:
```bash
# Migrations akan otomatis dijalankan saat PocketBase start
# Atau manual via Admin UI
```

## Troubleshooting

### Port 8090 sudah digunakan
Edit `docker-compose.yml` dan ubah port mapping:
```yaml
ports:
  - "8091:8080"  # Ganti 8091 dengan port yang tersedia
```

### Permission denied di pb_data
```bash
chmod -R 755 pocketbase/pb_data
```

### Reset database
```bash
rm -rf pocketbase/pb_data
# Restart PocketBase untuk membuat database baru
```
