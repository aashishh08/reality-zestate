# Reality Estate Backend API

A production-ready Node.js backend using Express.js, PostgreSQL, and Sequelize ORM.

## Tech Stack

- **Framework**: Express.js 4.x
- **Language**: JavaScript (ESM modules)
- **Database**: PostgreSQL 12+
- **ORM**: Sequelize 6.x
- **Validation**: Express built-in + custom middleware
- **Security**: Helmet.js, CORS
- **Logging**: Morgan + custom logger

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── env.js          # Environment variables
│   └── database.js     # Database connection setup
├── models/             # Sequelize models
│   ├── index.js        # Model initialization
│   └── Example.js      # Example model template
├── migrations/         # Database migrations
│   └── EXAMPLE_*.js    # Migration templates
├── seeders/            # Database seeders
│   └── EXAMPLE_*.js    # Seeder templates
├── routes/             # API route definitions
│   ├── index.js        # Main API routes
│   └── health.js       # Health check endpoint
├── middlewares/        # Custom middlewares
│   ├── errorHandler.js # Global error handler
│   └── validators.js   # Request validation utilities
├── utils/              # Utility functions
│   └── logger.js       # Logging utility
└── index.js            # Application entry point
```

## Installation

### Prerequisites

- Node.js 18+ or higher
- PostgreSQL 12+ or higher
- npm or yarn

### Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database credentials:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=reality_estate_dev
   ```

3. **Create database** (if not exists):
   ```bash
   createdb reality_estate_dev
   ```

## Development

### Run in Development Mode

Watch mode with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Database Migrations

- **Create a new migration**:
  ```bash
  npx sequelize-cli migration:generate --name your-migration-name
  ```

- **Run migrations**:
  ```bash
  npm run db:migrate
  ```

- **Undo last migration**:
  ```bash
  npm run db:migrate:undo
  ```

- **Undo all migrations**:
  ```bash
  npm run db:migrate:undo:all
  ```

### Database Seeding

- **Create a new seeder**:
  ```bash
  npx sequelize-cli seed:generate --name your-seeder-name
  ```

- **Run seeders**:
  ```bash
  npm run db:seed
  ```

- **Undo seeders**:
  ```bash
  npm run db:seed:undo:all
  ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript (if added in future)
- `npm start` - Start production server
- `npm run db:migrate` - Run pending migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:seed` - Seed database
- `npm run db:seed:undo` - Undo all seeds
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without changes

## API Endpoints

### Health Check

```
GET /health

Response:
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-31T10:00:00.000Z"
}
```

### Welcome Endpoint

```
GET /api/v1

Response:
{
  "success": true,
  "message": "Welcome to Reality Estate API",
  "version": "v1",
  "endpoints": { ... }
}
```

## Creating Models

1. Create a new file in `src/models/YourModel.js`:

```javascript
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const YourModel = sequelize.define(
    'YourModel',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Add more fields...
    },
    {
      tableName: 'your_models',
      timestamps: true,
      underscored: true,
    },
  );

  return YourModel;
};
```

2. Import and initialize in `src/models/index.js`:

```javascript
import YourModel from './YourModel.js';

export const initializeModels = async (sequelize) => {
  const yourModel = YourModel(sequelize);
  
  // Add associations here
  
  return { yourModel };
};
```

3. Create a migration in `src/migrations/`:

```javascript
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('your_models', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // Match your model fields...
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('your_models');
}
```

## Creating Routes

1. Create a new file in `src/routes/yourResource.js`:

```javascript
import express from 'express';
import { asyncHandler } from '../middlewares/validators.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  // Your endpoint logic
  res.json({ success: true, data: [] });
}));

export default router;
```

2. Mount in `src/routes/index.js`:

```javascript
import yourResourceRouter from './yourResource.js';

router.use('/your-resource', yourResourceRouter);
```

## Error Handling

The application uses a global error handler middleware. Throw errors in this format:

```javascript
throw {
  status: 400,
  message: 'User validation failed',
};
```

The error handler will format and send appropriate HTTP responses.

## Production Deployment

1. **Environment Setup**:
   ```bash
   NODE_ENV=production
   PORT=3000
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_USER=prod_user
   DB_PASSWORD=strong_password
   DB_NAME=reality_estate_prod
   DB_SSL=true
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Database Setup**:
   ```bash
   npm run db:migrate
   npm run db:seed  # Optional, if needed
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

## Code Quality

- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier
- **ESM Modules**: Full ES6 module support

Run before committing:
```bash
npm run lint
npm run format
```

## Logging

Use the logger utility in your controllers:

```javascript
import { logger } from '../utils/logger.js';

logger.info('User created', { userId: 123 });
logger.error('Database error', error);
logger.warn('Deprecated endpoint used');
logger.debug('Debug information');
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and ensure code quality: `npm run lint && npm run format`
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/your-feature`

## License

ISC

## Support

For issues or questions, please contact the development team.
