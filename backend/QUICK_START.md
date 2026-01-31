# Backend Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL

If you don't have PostgreSQL installed:

**macOS (using Homebrew)**:
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows**: Download installer from https://www.postgresql.org/download/windows/

### 3. Create Database

```bash
createdb reality_estate_dev
```

Or with password:
```bash
psql -U postgres
CREATE DATABASE reality_estate_dev;
\q
```

### 4. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=reality_estate_dev
```

### 5. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## First Steps

### Test Health Endpoint

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-31T10:00:00.000Z"
}
```

### Test Welcome Endpoint

```bash
curl http://localhost:3000/api/v1
```

## Creating Your First Resource

### 1. Create a Model

Create `src/models/User.js`:

```javascript
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
    },
  );

  return User;
};
```

### 2. Create a Migration

```bash
npx sequelize-cli migration:generate --name create-users-table
```

Edit `src/migrations/[timestamp]_create-users-table.js`:

```javascript
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('users');
}
```

### 3. Run Migration

```bash
npm run db:migrate
```

### 4. Create a Service

Create `src/services/userService.js`:

```javascript
import { logger } from '../utils/logger.js';
import { User } from '../models/index.js';

class UserService {
  async findAll(options = {}) {
    try {
      const users = await User.findAll(options);
      return users;
    } catch (error) {
      logger.error('UserService: findAll error', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }
      return user;
    } catch (error) {
      logger.error('UserService: findById error', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      logger.error('UserService: create error', error);
      throw {
        status: 400,
        message: 'Failed to create user',
      };
    }
  }

  async update(id, data) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }
      await user.update(data);
      return user;
    } catch (error) {
      logger.error('UserService: update error', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }
      await user.destroy();
      return true;
    } catch (error) {
      logger.error('UserService: delete error', error);
      throw error;
    }
  }
}

export default new UserService();
```

### 5. Create a Controller

Create `src/controllers/userController.js`:

```javascript
import userService from '../services/userService.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants.js';

class UserController {
  async getAll(req, res) {
    const users = await userService.findAll();
    res.json({
      success: true,
      data: users,
    });
  }

  async getById(req, res) {
    const { id } = req.params;
    const user = await userService.findById(id);
    res.json({
      success: true,
      data: user,
    });
  }

  async create(req, res) {
    const user = await userService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: user,
      message: SUCCESS_MESSAGES.CREATED,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const user = await userService.update(id, req.body);
    res.json({
      success: true,
      data: user,
      message: SUCCESS_MESSAGES.UPDATED,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    await userService.delete(id);
    res.json({
      success: true,
      message: SUCCESS_MESSAGES.DELETED,
    });
  }
}

export default new UserController();
```

### 6. Create Routes

Create `src/routes/users.js`:

```javascript
import express from 'express';
import userController from '../controllers/userController.js';
import { asyncHandler } from '../middlewares/validators.js';

const router = express.Router();

router.get('/', asyncHandler((req, res) => userController.getAll(req, res)));
router.post('/', asyncHandler((req, res) => userController.create(req, res)));
router.get('/:id', asyncHandler((req, res) => userController.getById(req, res)));
router.put('/:id', asyncHandler((req, res) => userController.update(req, res)));
router.delete('/:id', asyncHandler((req, res) => userController.delete(req, res)));

export default router;
```

### 7. Mount Routes

Update `src/routes/index.js`:

```javascript
import express from 'express';
import usersRouter from './users.js';

const router = express.Router();

router.use('/users', usersRouter);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Reality Estate API',
    version: 'v1',
    endpoints: {
      health: '/health',
      users: '/users',
    },
  });
});

export default router;
```

## Testing Your Endpoints

### Create User

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get All Users

```bash
curl http://localhost:3000/api/v1/users
```

### Get User by ID

```bash
curl http://localhost:3000/api/v1/users/{id}
```

### Update User

```bash
curl -X PUT http://localhost:3000/api/v1/users/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane"
  }'
```

### Delete User

```bash
curl -X DELETE http://localhost:3000/api/v1/users/{id}
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run lint` | Check code quality |
| `npm run format` | Format code with Prettier |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:seed` | Seed database |
| `npm start` | Start production server |

## Troubleshooting

### Database Connection Error

Check if PostgreSQL is running:
```bash
psql -U postgres -c "SELECT 1;"
```

### Port Already in Use

Change PORT in `.env`:
```env
PORT=3001
```

### Migration Issues

Reset database (⚠️ deletes all data):
```bash
npm run db:migrate:undo:all
npm run db:migrate
```

## Next Steps

1. Create more models for your application
2. Set up authentication middleware
3. Add input validation using custom validators
4. Implement business logic in services
5. Add comprehensive error handling
6. Setup logging and monitoring

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
