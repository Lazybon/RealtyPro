'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationModal({ open, onOpenChange }: RegistrationModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    if (firstName) params.set('firstName', firstName);
    if (lastName) params.set('lastName', lastName);
    const query = params.toString();
    window.location.href = `${APP_URL}/register${query ? `?${query}` : ''}`;
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setFirstName('');
      setLastName('');
      setEmail('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Регистрация в RealtyPro</DialogTitle>
          <DialogDescription>
            Начните с заполнения основных данных — регистрация займёт меньше минуты
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-firstName">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-firstName"
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10"
                  data-testid="input-reg-first-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-lastName">Фамилия</Label>
              <Input
                id="reg-lastName"
                placeholder="Иванов"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                data-testid="input-reg-last-name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="reg-email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                data-testid="input-reg-email"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" data-testid="button-register-submit">
            Продолжить регистрацию
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Уже есть аккаунт?{' '}
            <a
              href={`${APP_URL}/login`}
              className="text-primary hover:underline"
              data-testid="link-login"
            >
              Войти
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
