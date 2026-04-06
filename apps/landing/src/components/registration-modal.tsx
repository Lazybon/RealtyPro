'use client';

/**
 * Модалка с формой (имя, фамилия, email → редирект на `${NEXT_PUBLIC_APP_URL}/register`) отключена:
 * все кнопки лендинга ведут напрямую на {@link WEB_APP_URL} из `@/lib/web-app-url`.
 *
 * Прежняя разметка сохранена ниже в комментарии для справки.
 */

/*
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
import { Building2, Mail, User, ArrowRight } from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';

interface _RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function _RegistrationModal({ open, onOpenChange }: _RegistrationModalProps) {
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

  const handleClose = (next: boolean) => {
    if (!next) {
      setFirstName('');
      setLastName('');
      setEmail('');
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Регистрация в RealtyPro</DialogTitle>
          <DialogDescription>
            Начните с заполнения основных данных — регистрация займёт меньше минуты
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          ... поля Имя, Фамилия, Email, кнопка «Продолжить регистрацию», ссылка «Войти» на APP_URL/login ...
        </form>
      </DialogContent>
    </Dialog>
  );
}
*/

export interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationModal(_props: RegistrationModalProps): null {
  return null;
}
