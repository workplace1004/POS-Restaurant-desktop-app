import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { POS_API_PREFIX as API } from '../lib/apiOrigin.js';
import { Dropdown } from './Dropdown';
import { KeyboardWithNumpad } from './KeyboardWithNumpad';

export function ProductLabelsModal({ open, onClose }) {
  const { t } = useLanguage();
  const tr = (key, fallback) => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  const [labelCategories, setLabelCategories] = useState([]);
  const [labelCategoryId, setLabelCategoryId] = useState('');
  const [labelProducts, setLabelProducts] = useState([]);
  const [labelProductsLoading, setLabelProductsLoading] = useState(false);
  const [labelSelectedProductId, setLabelSelectedProductId] = useState('');
  const [labelSearch, setLabelSearch] = useState('');
  const [labelPrintCount, setLabelPrintCount] = useState('1');
  const [labelFormats, setLabelFormats] = useState([]);
  const [labelFormat, setLabelFormat] = useState('');
  const [includeProductName, setIncludeProductName] = useState(true);
  const [includePrice, setIncludePrice] = useState(true);
  const [includeBarcode, setIncludeBarcode] = useState(true);
  const [activeField, setActiveField] = useState('search');
  const [categorySortDirection, setCategorySortDirection] = useState('asc');

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    const run = async () => {
      setLabelProductsLoading(true);
      try {
        const [catRes, productsRes] = await Promise.all([
          fetch(`${API}/categories`),
          fetch(`${API}/products/catalog`)
        ]);
        const categories = await catRes.json().catch(() => []);
        const products = await productsRes.json().catch(() => []);
        const formatsRes = await fetch(`${API}/printer-labels`);
        const formats = await formatsRes.json().catch(() => []);
        if (cancelled) return;
        setLabelCategories(Array.isArray(categories) ? categories : []);
        setLabelProducts(Array.isArray(products) ? products : []);
        const nextFormats = Array.isArray(formats) ? formats : [];
        setLabelFormats(nextFormats);
        const defaultFormat =
          nextFormats.find((f) => f?.standard)?.sizeLabel
          || nextFormats.find((f) => f?.standard)?.name
          || nextFormats[0]?.sizeLabel
          || nextFormats[0]?.name
          || '';
        setLabelFormat(String(defaultFormat || ''));
      } catch {
        if (cancelled) return;
        setLabelCategories([]);
        setLabelProducts([]);
        setLabelFormats([]);
        setLabelFormat('');
      } finally {
        if (!cancelled) setLabelProductsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLabelCategoryId('');
    setLabelSelectedProductId('');
    setLabelSearch('');
    setLabelPrintCount('1');
    setLabelFormat('');
    setIncludeProductName(true);
    setIncludePrice(true);
    setIncludeBarcode(true);
    setActiveField('search');
    setCategorySortDirection('asc');
  }, [open]);

  const categoryOptions = useMemo(
    () => {
      const sorted = [...labelCategories].sort((a, b) => {
        const left = String(a?.name || '').toLowerCase();
        const right = String(b?.name || '').toLowerCase();
        if (left === right) return 0;
        return categorySortDirection === 'asc' ? (left < right ? -1 : 1) : (left > right ? -1 : 1);
      });
      return [
        { value: '', label: tr('allCategories', 'All Categories') },
        ...sorted.map((cat) => ({ value: String(cat?.id || ''), label: String(cat?.name || '-') }))
      ];
    },
    [labelCategories, categorySortDirection]
  );
  const formatOptions = useMemo(
    () => labelFormats.map((format) => {
      const label = String(format?.sizeLabel || format?.name || '').trim();
      return { value: label, label };
    }).filter((opt) => opt.value),
    [labelFormats]
  );

  const filteredLabelProducts = useMemo(() => {
    const term = labelSearch.trim().toLowerCase();
    return labelProducts
      .filter((p) => {
        if (labelCategoryId && String(p?.categoryId || '') !== String(labelCategoryId)) return false;
        if (!term) return true;
        return String(p?.name || '').toLowerCase().includes(term);
      })
      .sort((a, b) => {
        const left = String(a?.name || '').toLowerCase();
        const right = String(b?.name || '').toLowerCase();
        if (left === right) return 0;
        return categorySortDirection === 'asc' ? (left < right ? -1 : 1) : (left > right ? -1 : 1);
      });
  }, [labelProducts, labelCategoryId, labelSearch, categorySortDirection]);

  const selectedLabelProduct = useMemo(
    () => labelProducts.find((p) => String(p?.id) === String(labelSelectedProductId)) || null,
    [labelProducts, labelSelectedProductId]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[1300px] rounded-md bg-pos-panel px-6 py-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="grid grid-cols-[1fr_250px] gap-8">
          <div>
            <div className="mb-2 flex items-center gap-10">
              <Dropdown
                options={categoryOptions}
                value={labelCategoryId}
                onChange={setLabelCategoryId}
                placeholder={tr('allCategories', 'All Categories')}
                className="min-w-[220px]"
                labelClassName="max-h-[360px]"
              />
              <button
                type="button"
                className="h-[38px] w-[38px] rounded border border-pos-inputBorder bg-pos-panel text-pos-text active:bg-green-500"
                onClick={() => setCategorySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                aria-label={categorySortDirection === 'asc' ? tr('sortDescending', 'Sort descending') : tr('sortAscending', 'Sort ascending')}
                title={categorySortDirection === 'asc' ? tr('sortDescending', 'Sort descending') : tr('sortAscending', 'Sort ascending')}
              >
                {categorySortDirection === 'asc' ? 'v' : '^'}
              </button>
              <input
                value={labelSearch}
                onChange={(e) => setLabelSearch(e.target.value)}
                className="h-[38px] min-w-[260px] rounded border border-pos-inputBorder bg-pos-panel text-pos-text px-3"
                placeholder={tr('search', 'Search')}
                onFocus={() => setActiveField('search')}
              />
            </div>
            <div className="h-[420px] overflow-auto border border-pos-border bg-pos-bg">
              {labelProductsLoading ? (
                <div className="p-3 text-pos-text">{tr('loading', 'Loading...')}</div>
              ) : filteredLabelProducts.length === 0 ? (
                <div className="p-3 text-pos-text">{tr('noProductsFound', 'No products found')}</div>
              ) : (
                filteredLabelProducts.map((product) => {
                  const isActive = String(labelSelectedProductId) === String(product?.id);
                  return (
                    <button
                      key={product?.id}
                      type="button"
                      className={`block w-full px-3 py-1 text-left ${isActive ? 'bg-green-500 text-white' : 'text-pos-text active:bg-green-500'}`}
                      onClick={() => setLabelSelectedProductId(product?.id || '')}
                    >
                      {product?.name || '-'}
                    </button>
                  );
                })
              )}
            </div>
          </div>
          <div className="text-pos-text h-full flex flex-col justify-between py-5">
            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-between gap-3">
                <span>{tr('productName', 'Productname')}:</span>
                <input
                  type="checkbox"
                  checked={includeProductName}
                  onChange={(e) => setIncludeProductName(e.target.checked)}
                  className="w-8 h-8 accent-green-500"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{tr('price', 'Price')}:</span>
                <input
                  type="checkbox"
                  checked={includePrice}
                  onChange={(e) => setIncludePrice(e.target.checked)}
                  className="w-8 h-8 accent-green-500"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{tr('barcode', 'Barcode')}:</span>
                <input
                  type="checkbox"
                  checked={includeBarcode}
                  onChange={(e) => setIncludeBarcode(e.target.checked)}
                  className="w-8 h-8 accent-green-500"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{tr('numberOfPrints', 'Number of prints')}:</span>
                <input
                  value={labelPrintCount}
                  onChange={(e) => setLabelPrintCount(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
                  className="h-[32px] w-[72px] rounded bg-pos-bg px-2 border border-pos-inputBorder text-center"
                  onFocus={() => setActiveField('prints')}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{tr('format', 'Format')}:</span>
                <Dropdown
                  options={formatOptions}
                  value={labelFormat}
                  onChange={setLabelFormat}
                  placeholder={tr('format', 'Format')}
                  className="min-w-[180px]"
                />
              </div>
            </div>
            <div className="mt-10 flex items-center justify-between gap-3">
              <button type="button" className="h-[40px] min-w-[110px] rounded bg-pos-bg border border-pos-inputBorder text-pos-text active:bg-green-500" onClick={onClose}>
                {tr('closeWindow', 'Close')}
              </button>
              <button type="button" disabled={!selectedLabelProduct} className={`h-[40px] min-w-[110px] rounded ${selectedLabelProduct ? 'bg-pos-bg border border-pos-inputBorder text-pos-text active:bg-green-500' : 'bg-pos-bg border border-pos-inputBorder text-pos-muted cursor-not-allowed'}`}>
                {tr('print', 'Print')}
              </button>
            </div>
          </div>
        </div>
        <div className='bg-pos-bg flex justify-center items-center'>
          <KeyboardWithNumpad
            value={activeField === 'prints' ? labelPrintCount : labelSearch}
            onChange={(next) => {
              if (activeField === 'prints') {
                setLabelPrintCount(String(next).replace(/[^\d]/g, '').slice(0, 3));
                return;
              }
              setLabelSearch(next);
            }}
          />
        </div>
      </div>
    </div>
  );
}
