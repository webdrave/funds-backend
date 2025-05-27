// Define interface for User type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple in-memory data store (in a real application, you would use a database)
const users: User[] = [];

// User model methods
export const UserModel = {
  // Find all users
  findAll: (): User[] => {
    return users;
  },
  
  // Find user by ID
  findById: (id: string): User | undefined => {
    return users.find(user => user.id === id);
  },
    // Create a new user
  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    users.push(newUser);
    return newUser;
  },
  
  // Update a user
  update: (id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): User | null => {
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedUser: User = {
      ...users[index],
      ...userData,
      updatedAt: new Date(),
    };
    
    users[index] = updatedUser;
    return updatedUser;
  },
  
  // Delete a user
  delete: (id: string): boolean => {
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return false;
    }
    
    users.splice(index, 1);
    return true;
  },
};

export default {
  User: UserModel,
};
