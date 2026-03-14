#!/bin/bash
set -e
npm install
cd packages/database && npx prisma db push
