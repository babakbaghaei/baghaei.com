'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * قیمت‌های لحظه‌ای بازار (تومان) از روت /api/market.
 *
 * استفاده: ابزارهای طلا و سکه با این هوک قیمت روز را پیش‌فرض پر می‌کنند، اما کاربر
 * می‌تواند مقدار را ویرایش کند و اگر دریافت ناموفق بود، ابزار به ورودی دستی برمی‌گردد
 * (هیچ‌گاه قفل نمی‌شود و آفلاین هم کار می‌کند).
 */

export interface MarketPrices {
  gram18?: number;
  gram24?: number;
  sekee?: number;
  nim?: number;
  rob?: number;
  mesghal?: number;
  dollar?: number;
}

export interface MarketState {
  prices: MarketPrices | null;
  updatedAt: string | null;
  loading: boolean;
  error: boolean;
  refresh: () => void;
}

export function useMarketPrice(): MarketState {
  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => {
    setNonce((n) => n + 1);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    fetch('/api/market', { cache: nonce === 0 ? 'default' : 'reload' })
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data?.ok && data.prices) {
          setPrices(data.prices as MarketPrices);
          setUpdatedAt(typeof data.updatedAt === 'string' ? data.updatedAt : null);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [nonce]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { prices, updatedAt, loading, error, refresh };
}
