import { FastifyInstance, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

interface LoginBody {
  username: string;
  password: string;
}

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', async (request: FastifyRequest<{ Body: LoginBody }>) => {
    const { username, password } = request.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw { statusCode: 400, message: 'Username already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      character: {
        level: 1,
        experience: 0,
        stats: {
          health: 100,
          attack: 10,
          defense: 5,
          speed: 5,
        },
        inventory: [],
      },
    });

    await user.save();

    // Generate token
    const token = fastify.jwt.sign({
      id: user._id,
      username: user.username,
    });

    return { token };
  });

  fastify.post('/login', async (request: FastifyRequest<{ Body: LoginBody }>) => {
    const { username, password } = request.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    // Generate token
    const token = fastify.jwt.sign({
      id: user._id,
      username: user.username,
    });

    return { token };
  });
};
