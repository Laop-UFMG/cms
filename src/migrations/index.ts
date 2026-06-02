import * as migration_20260602_230011_v1_initial from './20260602_230011_v1_initial';

export const migrations = [
  {
    up: migration_20260602_230011_v1_initial.up,
    down: migration_20260602_230011_v1_initial.down,
    name: '20260602_230011_v1_initial'
  },
];
