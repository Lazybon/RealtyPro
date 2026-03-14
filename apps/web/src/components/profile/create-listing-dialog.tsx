'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  propertyType: string;
  dealType: string;
  price: string;
  area: string;
  rooms: string;
  floor: string;
  totalFloors: string;
  address: string;
  city: string;
  district: string;
  metroStation: string;
}

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
}

export function CreateListingDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  isPending,
}: CreateListingDialogProps) {
  const updateField = (field: keyof FormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-listing">
          <Plus className="mr-2 h-4 w-4" />
          Добавить объявление
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Новое объявление</DialogTitle>
          <DialogDescription>
            Заполните информацию о недвижимости
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Например: 2-комнатная квартира в центре"
              required
              data-testid="input-title"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Тип недвижимости</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => updateField('propertyType', value)}
              >
                <SelectTrigger data-testid="select-property-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Квартира</SelectItem>
                  <SelectItem value="house">Дом</SelectItem>
                  <SelectItem value="studio">Студия</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dealType">Тип сделки</Label>
              <Select
                value={formData.dealType}
                onValueChange={(value) => updateField('dealType', value)}
              >
                <SelectTrigger data-testid="select-deal-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Продажа</SelectItem>
                  <SelectItem value="rent">Аренда</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="5000000"
                required
                data-testid="input-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Площадь (м²) *</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                value={formData.area}
                onChange={(e) => updateField('area', e.target.value)}
                placeholder="45"
                required
                data-testid="input-area"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rooms">Комнат *</Label>
              <Select
                value={formData.rooms}
                onValueChange={(value) => updateField('rooms', value)}
              >
                <SelectTrigger data-testid="select-rooms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Этаж</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) => updateField('floor', e.target.value)}
                placeholder="5"
                data-testid="input-floor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalFloors">Всего этажей</Label>
              <Input
                id="totalFloors"
                type="number"
                value={formData.totalFloors}
                onChange={(e) => updateField('totalFloors', e.target.value)}
                placeholder="12"
                data-testid="input-total-floors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Город *</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => updateField('city', value)}
            >
              <SelectTrigger data-testid="select-city">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Москва">Москва</SelectItem>
                <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                <SelectItem value="Казань">Казань</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Адрес *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="ул. Тверская, д. 10"
              required
              data-testid="input-address"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="district">Район</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                placeholder="Центральный"
                data-testid="input-district"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metroStation">Метро</Label>
              <Input
                id="metroStation"
                value={formData.metroStation}
                onChange={(e) => updateField('metroStation', e.target.value)}
                placeholder="Тверская"
                data-testid="input-metro"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Опишите преимущества вашей недвижимости..."
              rows={4}
              data-testid="input-description"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-testid="button-submit"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Создать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
