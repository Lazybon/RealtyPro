'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleChip } from './toggle-chip';
import { CollapsibleSection } from './collapsible-section';
import { FilterRow } from './filter-row';

interface AdvancedFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filteredCount: number;
  onApply: (params: {
    dealType?: string;
    rooms?: string;
    priceRange?: [number, number];
    areaRange?: [number, number];
  }) => void;
}

export function AdvancedFiltersDialog({
  open,
  onOpenChange,
  filteredCount,
  onApply,
}: AdvancedFiltersDialogProps) {
  const [advGoal, setAdvGoal] = useState<'buy' | 'rent'>('buy');
  const [advPropertyType, setAdvPropertyType] = useState('apartment_secondary');
  const [advRooms, setAdvRooms] = useState<string[]>([]);
  const [advPriceType, setAdvPriceType] = useState<'object' | 'sqm' | 'mortgage'>('object');
  const [advPriceFrom, setAdvPriceFrom] = useState('');
  const [advPriceTo, setAdvPriceTo] = useState('');
  const [advAreaFrom, setAdvAreaFrom] = useState('');
  const [advAreaTo, setAdvAreaTo] = useState('');
  const [advFloorFrom, setAdvFloorFrom] = useState('');
  const [advFloorTo, setAdvFloorTo] = useState('');
  const [advFloorOptions, setAdvFloorOptions] = useState<string[]>([]);
  const [advTotalFloorsFrom, setAdvTotalFloorsFrom] = useState('');
  const [advTotalFloorsTo, setAdvTotalFloorsTo] = useState('');

  const [advRenovation, setAdvRenovation] = useState<string[]>([]);
  const [advKitchenArea, setAdvKitchenArea] = useState<string>('');
  const [advBathroom, setAdvBathroom] = useState<string[]>([]);
  const [advBalcony, setAdvBalcony] = useState<string[]>([]);
  const [advCeilingHeight, setAdvCeilingHeight] = useState<string>('');

  const [advSaleType, setAdvSaleType] = useState<string[]>([]);
  const [advAdvantages, setAdvAdvantages] = useState<string[]>([]);
  const [advSeller, setAdvSeller] = useState<string[]>([]);
  const [advAuction, setAdvAuction] = useState<string[]>([]);

  const [advPostDate, setAdvPostDate] = useState<string>('');
  const [advExtra, setAdvExtra] = useState<string[]>([]);

  const toggleArrayValue = useCallback((arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }, []);

  const resetAdvancedFilters = () => {
    setAdvGoal('buy');
    setAdvPropertyType('apartment_secondary');
    setAdvRooms([]);
    setAdvPriceType('object');
    setAdvPriceFrom('');
    setAdvPriceTo('');
    setAdvAreaFrom('');
    setAdvAreaTo('');
    setAdvFloorFrom('');
    setAdvFloorTo('');
    setAdvFloorOptions([]);
    setAdvTotalFloorsFrom('');
    setAdvTotalFloorsTo('');
    setAdvRenovation([]);
    setAdvKitchenArea('');
    setAdvBathroom([]);
    setAdvBalcony([]);
    setAdvCeilingHeight('');
    setAdvSaleType([]);
    setAdvAdvantages([]);
    setAdvSeller([]);
    setAdvAuction([]);
    setAdvPostDate('');
    setAdvExtra([]);
  };

  const handleApply = () => {
    const params: Parameters<typeof onApply>[0] = {};

    if (advGoal === 'buy') params.dealType = 'sale';
    else if (advGoal === 'rent') params.dealType = 'rent';

    if (advRooms.length === 1) {
      const r = advRooms[0];
      if (r === 'Студия') params.rooms = 'any';
      else if (r === '5+') params.rooms = '4';
      else params.rooms = r;
    }

    if (advPriceFrom || advPriceTo) {
      params.priceRange = [
        advPriceFrom ? Number(advPriceFrom) : 1000000,
        advPriceTo ? Number(advPriceTo) : 100000000,
      ];
    }

    if (advAreaFrom || advAreaTo) {
      params.areaRange = [
        advAreaFrom ? Number(advAreaFrom) : 10,
        advAreaTo ? Number(advAreaTo) : 300,
      ];
    }

    onApply(params);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto" data-testid="dialog-advanced-filters">
        <DialogHeader>
          <DialogTitle className="text-2xl">Фильтры</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <FilterRow label="Цель">
            <div className="flex rounded-full border">
              <Button
                variant={advGoal === 'buy' ? 'default' : 'ghost'}
                className="flex-1 rounded-full rounded-r-none"
                onClick={() => setAdvGoal('buy')}
                data-testid="button-adv-goal-buy"
              >
                Купить
              </Button>
              <Button
                variant={advGoal === 'rent' ? 'default' : 'ghost'}
                className="flex-1 rounded-full rounded-l-none"
                onClick={() => setAdvGoal('rent')}
                data-testid="button-adv-goal-rent"
              >
                Снять
              </Button>
            </div>
          </FilterRow>

          <FilterRow label="Вид недвижимости">
            <Select value={advPropertyType} onValueChange={setAdvPropertyType}>
              <SelectTrigger data-testid="select-adv-property-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment_secondary">Квартира во вторичке</SelectItem>
                <SelectItem value="apartment_new">Квартира в новостройке</SelectItem>
                <SelectItem value="house">Дом с участком</SelectItem>
                <SelectItem value="room">Комната</SelectItem>
                <SelectItem value="land">Земельный участок</SelectItem>
              </SelectContent>
            </Select>
          </FilterRow>

          <FilterRow label="Количество комнат">
            <div className="flex flex-wrap gap-2">
              {['Студия', '1', '2', '3', '4', '5+'].map((r) => (
                <ToggleChip
                  key={r}
                  label={r}
                  active={advRooms.includes(r)}
                  onClick={() => toggleArrayValue(advRooms, r, setAdvRooms)}
                  data-testid={`chip-adv-rooms-${r}`}
                />
              ))}
            </div>
          </FilterRow>

          <FilterRow label="Цена">
            <div className="space-y-3">
              <div className="flex rounded-full border">
                {(['object', 'sqm', 'mortgage'] as const).map((t) => (
                  <Button
                    key={t}
                    variant={advPriceType === t ? 'default' : 'ghost'}
                    className={cn(
                      'flex-1 rounded-full',
                      t === 'object' && 'rounded-r-none',
                      t === 'sqm' && 'rounded-none',
                      t === 'mortgage' && 'rounded-l-none'
                    )}
                    size="sm"
                    onClick={() => setAdvPriceType(t)}
                    data-testid={`button-adv-price-type-${t}`}
                  >
                    {t === 'object' ? 'За объект' : t === 'sqm' ? 'За м²' : 'Ипотека'}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="От"
                  value={advPriceFrom}
                  onChange={(e) => setAdvPriceFrom(e.target.value)}
                  data-testid="input-adv-price-from"
                />
                <Input
                  placeholder="До"
                  value={advPriceTo}
                  onChange={(e) => setAdvPriceTo(e.target.value)}
                  data-testid="input-adv-price-to"
                />
                <span className="flex items-center text-sm text-muted-foreground">₽</span>
              </div>
            </div>
          </FilterRow>

          <FilterRow label="Общая площадь">
            <div className="flex gap-2">
              <Input
                placeholder="От"
                value={advAreaFrom}
                onChange={(e) => setAdvAreaFrom(e.target.value)}
                data-testid="input-adv-area-from"
              />
              <Input
                placeholder="До"
                value={advAreaTo}
                onChange={(e) => setAdvAreaTo(e.target.value)}
                data-testid="input-adv-area-to"
              />
              <span className="flex items-center text-sm text-muted-foreground">м²</span>
            </div>
          </FilterRow>

          <FilterRow label="Этаж">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="От"
                  value={advFloorFrom}
                  onChange={(e) => setAdvFloorFrom(e.target.value)}
                  data-testid="input-adv-floor-from"
                />
                <Input
                  placeholder="До"
                  value={advFloorTo}
                  onChange={(e) => setAdvFloorTo(e.target.value)}
                  data-testid="input-adv-floor-to"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Не первый', 'Не последний', 'Последний'].map((opt) => (
                  <ToggleChip
                    key={opt}
                    label={opt}
                    active={advFloorOptions.includes(opt)}
                    onClick={() => toggleArrayValue(advFloorOptions, opt, setAdvFloorOptions)}
                    data-testid={`chip-adv-floor-${opt}`}
                  />
                ))}
              </div>
            </div>
          </FilterRow>

          <FilterRow label="Количество этажей">
            <div className="flex gap-2">
              <Input
                placeholder="От"
                value={advTotalFloorsFrom}
                onChange={(e) => setAdvTotalFloorsFrom(e.target.value)}
                data-testid="input-adv-floors-from"
              />
              <Input
                placeholder="До"
                value={advTotalFloorsTo}
                onChange={(e) => setAdvTotalFloorsTo(e.target.value)}
                data-testid="input-adv-floors-to"
              />
            </div>
          </FilterRow>

          <CollapsibleSection title="Квартира" defaultOpen data-testid="section-apartment">
            <FilterRow label="Ремонт" info>
              <div className="flex flex-wrap gap-2">
                {['Без ремонта', 'Евроремонт', 'Дизайнерский', 'Косметический'].map((r) => (
                  <ToggleChip
                    key={r}
                    label={r}
                    active={advRenovation.includes(r)}
                    onClick={() => toggleArrayValue(advRenovation, r, setAdvRenovation)}
                    data-testid={`chip-adv-renovation-${r}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Площадь кухни">
              <div className="flex flex-wrap gap-2">
                {['От 6 м²', 'От 7 м²', 'От 8 м²', 'От 9 м²', 'От 10 м²', 'От 12 м²', 'От 15 м²'].map((k) => (
                  <ToggleChip
                    key={k}
                    label={k}
                    active={advKitchenArea === k}
                    onClick={() => setAdvKitchenArea(advKitchenArea === k ? '' : k)}
                    data-testid={`chip-adv-kitchen-${k}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Санузел">
              <div className="flex flex-wrap gap-2">
                {['Совмещенный', 'Раздельный'].map((b) => (
                  <ToggleChip
                    key={b}
                    label={b}
                    active={advBathroom.includes(b)}
                    onClick={() => toggleArrayValue(advBathroom, b, setAdvBathroom)}
                    data-testid={`chip-adv-bathroom-${b}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Балкон или лоджия">
              <div className="flex flex-wrap gap-2">
                {['1', '2', '3+'].map((bl) => (
                  <ToggleChip
                    key={bl}
                    label={bl}
                    active={advBalcony.includes(bl)}
                    onClick={() => toggleArrayValue(advBalcony, bl, setAdvBalcony)}
                    data-testid={`chip-adv-balcony-${bl}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Высота потолков">
              <div className="flex flex-wrap gap-2">
                {['От 2,5 м', 'От 2,7 м', 'От 3 м', 'От 4 м'].map((ch) => (
                  <ToggleChip
                    key={ch}
                    label={ch}
                    active={advCeilingHeight === ch}
                    onClick={() => setAdvCeilingHeight(advCeilingHeight === ch ? '' : ch)}
                    data-testid={`chip-adv-ceiling-${ch}`}
                  />
                ))}
              </div>
            </FilterRow>
          </CollapsibleSection>

          <CollapsibleSection title="Сделка" data-testid="section-deal">
            <FilterRow label="Тип продажи" info>
              <div className="flex flex-wrap gap-2">
                {['Свободная', 'Альтернативная'].map((st) => (
                  <ToggleChip
                    key={st}
                    label={st}
                    active={advSaleType.includes(st)}
                    onClick={() => toggleArrayValue(advSaleType, st, setAdvSaleType)}
                    data-testid={`chip-adv-sale-${st}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Преимущества" info>
              <div className="flex flex-wrap gap-2">
                {['Одобрено в ипотеку', 'Отчёт Домклик'].map((ad) => (
                  <ToggleChip
                    key={ad}
                    label={ad}
                    active={advAdvantages.includes(ad)}
                    onClick={() => toggleArrayValue(advAdvantages, ad, setAdvAdvantages)}
                    data-testid={`chip-adv-advantage-${ad}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Продавец" info>
              <div className="flex flex-wrap gap-2">
                <ToggleChip
                  label="От собственника"
                  active={advSeller.includes('owner')}
                  onClick={() => toggleArrayValue(advSeller, 'owner', setAdvSeller)}
                  data-testid="chip-adv-seller-owner"
                />
              </div>
            </FilterRow>

            <FilterRow label="Объекты с аукционов" info>
              <div className="flex flex-wrap gap-2">
                <ToggleChip
                  label="Не показывать"
                  active={advAuction.includes('hide')}
                  onClick={() => toggleArrayValue(advAuction, 'hide', setAdvAuction)}
                  data-testid="chip-adv-auction-hide"
                />
              </div>
            </FilterRow>
          </CollapsibleSection>

          <CollapsibleSection title="Другое" data-testid="section-other">
            <FilterRow label="Дата размещения">
              <div className="flex flex-wrap gap-2">
                {['За час', 'Сегодня', 'За сутки', 'За 10 дней', 'За 30 дней'].map((d) => (
                  <ToggleChip
                    key={d}
                    label={d}
                    active={advPostDate === d}
                    onClick={() => setAdvPostDate(advPostDate === d ? '' : d)}
                    data-testid={`chip-adv-date-${d}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Дополнительно" info>
              <div className="flex flex-wrap gap-2">
                {['Только с видео', 'Только с фото', 'Доступен онлайн-показ'].map((ex) => (
                  <ToggleChip
                    key={ex}
                    label={ex}
                    active={advExtra.includes(ex)}
                    onClick={() => toggleArrayValue(advExtra, ex, setAdvExtra)}
                    data-testid={`chip-adv-extra-${ex}`}
                  />
                ))}
              </div>
            </FilterRow>
          </CollapsibleSection>
        </div>

        <DialogFooter className="sticky bottom-0 z-50 border-t bg-background pt-4">
          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1 gap-2" data-testid="button-adv-save-search">
              <Heart className="h-4 w-4" />
              Сохранить поиск
            </Button>
            <Button variant="outline" className="flex-1" onClick={resetAdvancedFilters} data-testid="button-adv-reset">
              Сбросить фильтры
            </Button>
            <Button className="flex-1" onClick={handleApply} data-testid="button-adv-apply">
              Показать {filteredCount} предложений
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
