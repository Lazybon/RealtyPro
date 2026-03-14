import { Card, CardContent } from '@/components/ui/card';
import { Bed, Square, Layers, Building2, Eye, Calendar } from 'lucide-react';
import { propertyTypeLabels } from '@/lib/constants';
import { formatDate } from '@/lib/format';

interface PropertyCharacteristicsProps {
  rooms: number;
  area: number;
  floor: number | null;
  totalFloors: number | null;
  propertyType: string;
  viewsCount: number;
  createdAt: string;
}

export function PropertyCharacteristics({
  rooms,
  area,
  floor,
  totalFloors,
  propertyType,
  viewsCount,
  createdAt,
}: PropertyCharacteristicsProps) {
  return (
    <Card data-testid="card-characteristics">
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Характеристики</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bed className="h-4 w-4" />
              <span>Комнаты</span>
            </div>
            <div className="font-semibold" data-testid="text-rooms">{rooms === 0 ? 'Студия' : rooms}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Square className="h-4 w-4" />
              <span>Площадь</span>
            </div>
            <div className="font-semibold" data-testid="text-area">{area} м²</div>
          </div>
          {floor != null && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span>Этаж</span>
              </div>
              <div className="font-semibold" data-testid="text-floor">
                {floor}{totalFloors ? ` из ${totalFloors}` : ''}
              </div>
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Тип</span>
            </div>
            <div className="font-semibold">{propertyTypeLabels[propertyType] || propertyType}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Просмотры</span>
            </div>
            <div className="font-semibold" data-testid="text-views">{viewsCount}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Опубликовано</span>
            </div>
            <div className="font-semibold" data-testid="text-date">{formatDate(createdAt)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
