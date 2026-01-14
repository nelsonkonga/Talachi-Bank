# 🚀 SChat - Guide de Démarrage Rapide

## Démarrage en Une Commande

### Démarrer tout le système
```bash
./start-all.sh
```

Le script s'exécute au premier plan et affiche l'état de tous les services.

### Arrêter tout le système
**Simplement appuyer sur Ctrl+C** dans le terminal où le script tourne.

Tous les services (Backend, Frontend) seront arrêtés proprement et automatiquement.

C'est aussi simple que ça ! 🎉

---

## Que fait le script de démarrage ?

Le script `start-all.sh` lance automatiquement dans l'ordre :

1. **PostgreSQL** - Vérifie et démarre la base de données
2. **Backend (Spring Boot)** - Compile (si nécessaire) et lance l'API sur le port 8080
3. **Frontend (Next.js)** - Installe les dépendances (si nécessaire) et lance l'interface sur le port 3000

### Logs

Tous les logs sont sauvegardés dans le dossier `logs/` :
- `logs/backend.log` - Logs du backend Spring Boot
- `logs/frontend.log` - Logs du frontend Next.js
- `logs/backend-build.log` - Logs de compilation du backend
- `logs/frontend-install.log` - Logs d'installation npm

Pour suivre les logs en temps réel :
```bash
# Backend
tail -f logs/backend.log

# Frontend
tail -f logs/frontend.log
```

### Arrêt Gracieux

Le script `start-all.sh` s'exécute au premier plan et garde le contrôle du terminal.

**Pour arrêter tous les services** : Appuyez simplement sur **Ctrl+C**

Le script interceptera le signal et :
1. Arrêtera proprement le frontend Next.js
2. Arrêtera proprement le backend Spring Boot
3. Nettoiera tous les processus
4. Libérera les ports 3000 et 8080

> **Note** : Le script `stop-all.sh` existe toujours comme méthode alternative si vous lancez les services en arrière-plan manuellement.

---

## URLs d'Accès

Une fois le système démarré :

- **Frontend (Interface utilisateur)** : http://localhost:3000
- **Backend API** : http://localhost:8080
- **PostgreSQL** : localhost:5432

---

## Prérequis

### 1. PostgreSQL
Le script vérifie automatiquement si PostgreSQL est démarré. Si ce n'est pas le cas, il tente de le démarrer automatiquement.

**Configuration requise** (dans `schatapi/src/main/resources/application.properties`) :
- Database: `schatdb`
- Username: `schatapiuser`
- Password: `Ngousso00`
- Port: `5432`

**Créer la base de données et l'utilisateur** (si ce n'est pas déjà fait) :
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE schatdb;
CREATE USER schatapiuser WITH PASSWORD 'Ngousso00';
GRANT ALL PRIVILEGES ON DATABASE schatdb TO schatapiuser;
\q
```

### 2. Java & Maven
- Java 17 ou supérieur
- Maven 3.6+ 

Vérifier :
```bash
java -version
mvn -version
```

### 3. Node.js & npm
- Node.js 18 ou supérieur
- npm 9+

Vérifier :
```bash
node -version
npm -version
```

---

## Utilisation Avancée

### Démarrage Manuel (sans script)

Si vous préférez démarrer les services manuellement :

**1. PostgreSQL**
```bash
sudo systemctl start postgresql
```

**2. Backend**
```bash
cd /home/Wallys/projets/schatapi
mvn spring-boot:run -pl schatapi
```

**3. Frontend (dans un nouveau terminal)**
```bash
cd /home/Wallys/projets/schatapi/schatclient
npm install  # Première fois seulement
npm run dev
```

### Recompiler le Backend

Si vous modifiez le code backend :
```bash
mvn clean package
```

Ou utilisez le script de démarrage qui détectera automatiquement les changements.

---

## Dépannage

### Le script ne démarre pas
```bash
# Vérifier les permissions
chmod +x start-all.sh stop-all.sh

# Relancer
./start-all.sh
```

### PostgreSQL ne démarre pas
```bash
# Démarrer manuellement
sudo systemctl start postgresql

# Vérifier le statut
sudo systemctl status postgresql
```

### Le port 8080 ou 3000 est déjà utilisé
```bash
# Trouver et tuer le processus utilisant le port 8080
sudo lsof -ti:8080 | xargs kill -9

# Trouver et tuer le processus utilisant le port 3000
sudo lsof -ti:3000 | xargs kill -9
```

### Les logs montrent des erreurs
```bash
# Voir les logs détaillés
cat logs/backend.log
cat logs/frontend.log
```

---

## Scripts Disponibles

| Script | Description |
|--------|-------------|
| `./start-all.sh` | Démarre tous les services (PostgreSQL, Backend, Frontend). Utiliser Ctrl+C pour arrêter. |
| `./stop-all.sh` | (Optionnel) Arrête tous les services si lancés en arrière-plan |

---

## Architecture

```
┌─────────────────┐
│   Frontend      │  http://localhost:3000
│   (Next.js)     │  
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Backend API   │  http://localhost:8080
│  (Spring Boot)  │  
└────────┬────────┘
         │ JPA/JDBC
         ▼
┌─────────────────┐
│   PostgreSQL    │  localhost:5432
│   (Database)    │  
└─────────────────┘
```

---

## Tester l'Installation

### 1. Enregistrer un utilisateur
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Accéder au frontend
Ouvrez votre navigateur : http://localhost:3000

---

## Support

Pour toute question ou problème, vérifiez :
1. Les logs dans le dossier `logs/`
2. Que tous les prérequis sont installés
3. Que les ports 3000, 8080, et 5432 sont disponibles

Bon développement ! 🚀
