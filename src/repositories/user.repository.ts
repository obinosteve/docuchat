import * as User from '../models/user.model.ts';

export function find(where?: Parameters<typeof User.find>[0]) {
  return User.find(where);
}

export function findById(id: string) {
  return User.findById(id);
}

export function findOne(where: Parameters<typeof User.findOne>[0]) {
  return User.findOne(where);
}

export function register(data: Parameters<typeof User.register>[0]) {
  return User.register(data);
}
