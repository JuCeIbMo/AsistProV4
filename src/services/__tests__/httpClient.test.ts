import { describe, expect, it } from 'vitest';
import { buildApiUrl, toSearchParams } from '../httpClient';

describe('httpClient helpers', () => {
  it('omits empty query params when building URLs', () => {
    const params = toSearchParams({
      cursor: 'next-page',
      direction: '',
      start_date: null,
      end_date: undefined,
      limit: '25',
    });

    expect(params).toEqual({
      cursor: 'next-page',
      limit: '25',
    });

    expect(buildApiUrl('/api/web/transactions', params)).toContain(
      '/api/web/transactions?cursor=next-page&limit=25',
    );
  });
});
