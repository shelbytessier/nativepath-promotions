'use client';

import type { CalendarEvent, Promotion, Channel } from '@/types';
import Link from 'next/link';

interface ChannelHolidayViewProps {
  event: CalendarEvent;
  channels: Channel[];
  promotions: Promotion[];
}

export default function ChannelHolidayView({ event, channels, promotions }: ChannelHolidayViewProps) {
  if (!event.channelPlans || event.channelPlans.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <h5 className="text-sm font-semibold text-white mb-3">Channel Plans & Angles</h5>
      {event.channelPlans.map((plan) => {
        const channel = channels.find((c) => c.id === plan.channelId);
        const channelPromotions = plan.promotionIds
          .map((id) => promotions.find((p) => p.id === id))
          .filter((p): p is Promotion => p !== undefined);

        return (
          <div
            key={plan.channelId}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#3a3a3a] transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h6 className="font-semibold text-white">
                {channel?.name || 'Unknown Channel'}
              </h6>
            </div>

            {/* Marketing Angle */}
            <div className="mb-3">
              <div className="text-xs font-medium text-[#b3b3b3] mb-1">Marketing Angle:</div>
              <div className="text-sm text-white font-medium">{plan.angle}</div>
            </div>

            {/* Promotions Running */}
            {channelPromotions.length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-medium text-[#b3b3b3] mb-2">Running Promotions:</div>
                <div className="space-y-2">
                  {channelPromotions.map((promo) => (
                    <Link
                      key={promo.id}
                      href="/promotions"
                      className="block p-2 bg-[#121212] border border-[#2a2a2a] rounded-lg hover:border-np-blue-600 hover:bg-np-blue-600 hover:bg-opacity-10 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{promo.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-np-blue-600 bg-opacity-20 text-np-blue-400 rounded-full">
                          {promo.discountType === 'percentage'
                            ? `${promo.discountValue}% off`
                            : promo.discountType === 'fixed'
                              ? `$${promo.discountValue} off`
                              : 'BOGO'}
                        </span>
                      </div>
                      {promo.description && (
                        <p className="text-xs text-[#b3b3b3] line-clamp-2">{promo.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Channel Notes */}
            {plan.notes && (
              <div className="mt-2 pt-2 border-t border-[#2a2a2a]">
                <div className="text-xs text-[#6b6b6b] italic">{plan.notes}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}





