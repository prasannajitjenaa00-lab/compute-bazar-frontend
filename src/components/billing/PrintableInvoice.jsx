import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PrintableInvoice = ({ bill, shopSettings = {} }) => {
  if (!bill) return null;

  const shopName = shopSettings.shopName || 'COMPUTER BAZAAR';
  const companyName = shopSettings.companyName || 'Dreamonix Solution';
  const website = shopSettings.website || 'https://dreamonixsolution.com/';
  const tagline = shopSettings.tagline || 'Computer, Laptop, CCTV & Networking Solutions';
  const phone = shopSettings.phone || '+91 98765 43210';
  const email = shopSettings.email || 'contact@dreamonixsolution.com';
  const address = shopSettings.address || '';
  const city = shopSettings.city || '';
  const state = shopSettings.state || '';
  const pincode = shopSettings.pincode || '';
  const fullAddress = [address, city, state, pincode].filter(Boolean).join(', ');
  const gstNumber = shopSettings.gstNumber;
  const currency = shopSettings.currencySymbol || '₹';
  const isTaxInvoice = Number(bill.taxAmount || 0) > 0;
  const customerName = bill.customerSnapshot?.name?.trim() || 'customer name';

  return (
    <div
      id="printable-invoice"
      className="hidden print:block font-sans text-black bg-white p-2 mx-auto text-xs leading-tight"
      style={{
        color: '#000',
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '190mm',
        minHeight: '270mm'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 210mm 297mm; /* Standard ISO A4 */
            margin: 8mm 10mm 8mm 10mm;
          }
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 11px !important;
            line-height: 1.25 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-invoice {
            display: block !important;
            width: 190mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}} />

      {/* Invoice Header (Compact A4 Header) */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-2">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt={shopName}
            className="h-10 w-auto object-contain max-w-[90px]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-baseline gap-1.5">
              <h1 className="text-base font-black uppercase tracking-tight text-slate-900 leading-none">{shopName}</h1>
              {companyName && (
                <span className="text-[10px] font-bold text-slate-700">| {companyName}</span>
              )}
            </div>
            <p className="text-[10px] text-slate-600 font-medium mt-0.5">{tagline}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              {fullAddress && <span>{fullAddress} • </span>}
              <span>Ph: {phone}</span>
              {email && <span> | {email}</span>}
              {website && <span className="font-semibold text-slate-800"> | Web: {website}</span>}
            </p>
            {gstNumber && (
              <p className="text-[10px] font-bold text-slate-900">
                GSTIN: {gstNumber}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded">
            {isTaxInvoice ? 'Tax Invoice' : 'Retail Invoice'}
          </span>
          <p className="text-xs font-bold text-slate-900 mt-1">
            #{bill.invoiceNumber}
          </p>
          <p className="text-[10px] text-slate-600">
            {formatDate(bill.date || bill.createdAt, true)}
          </p>
          <p className="text-[10px] text-slate-700 font-semibold">
            Mode: <span className="uppercase">{bill.paymentMode || 'Cash'}</span>
          </p>
        </div>
      </div>

      {/* Customer / Billed To Section (Compact Bar) */}
      <div className="grid grid-cols-2 gap-3 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded mb-2 text-[11px]">
        <div>
          <span className="font-bold text-slate-900 uppercase text-[9px] tracking-wider text-slate-500">Billed To: </span>
          <span className="font-bold text-slate-900">{customerName}</span>
          {bill.customerSnapshot?.phone && (
            <span className="text-slate-700 ml-2">• Ph: {bill.customerSnapshot.phone}</span>
          )}
          {bill.customerSnapshot?.address && (
            <p className="text-slate-600 text-[10px] truncate">Addr: {bill.customerSnapshot.address}</p>
          )}
          {bill.customerSnapshot?.gstNumber && (
            <p className="font-semibold text-slate-800 text-[10px]">GSTIN: {bill.customerSnapshot.gstNumber}</p>
          )}
        </div>

        <div className="text-right flex items-center justify-end gap-3 text-[11px]">
          <span className="text-slate-600">Status: <strong className="text-emerald-700">{bill.status || 'Paid'}</strong></span>
          {bill.dueAmount > 0 ? (
            <span className="font-bold text-rose-700">Due: {currency} {Number(bill.dueAmount).toFixed(2)}</span>
          ) : (
            <span className="font-bold text-emerald-700">Fully Paid</span>
          )}
        </div>
      </div>

      {/* Items Table (Tight Padding) */}
      <table className="w-full border-collapse text-[11px] mb-2">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="border border-slate-800 py-1 px-1.5 text-center w-8 font-bold">#</th>
            <th className="border border-slate-800 py-1 px-2 text-left font-bold">Item Description</th>
            <th className="border border-slate-800 py-1 px-1.5 text-center w-12 font-bold">Qty</th>
            <th className="border border-slate-800 py-1 px-2 text-right w-20 font-bold">Rate ({currency})</th>
            {isTaxInvoice && <th className="border border-slate-800 py-1 px-1.5 text-center w-14 font-bold">GST %</th>}
            <th className="border border-slate-800 py-1 px-2 text-right w-20 font-bold">Total ({currency})</th>
          </tr>
        </thead>
        <tbody>
          {(bill.items || []).map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="border border-slate-300 py-1 px-1.5 text-center text-slate-600">{index + 1}</td>
              <td className="border border-slate-300 py-1 px-2 font-medium text-slate-900">
                {item.name}
                {item.warranty && (
                  <span className="ml-1 text-[9px] text-slate-500 font-normal">({item.warranty})</span>
                )}
              </td>
              <td className="border border-slate-300 py-1 px-1.5 text-center font-bold text-slate-900">{item.qty}</td>
              <td className="border border-slate-300 py-1 px-2 text-right font-mono text-slate-800">
                {Number(item.unitPrice).toFixed(2)}
              </td>
              {isTaxInvoice && (
                <td className="border border-slate-300 py-1 px-1.5 text-center text-slate-700">
                  {item.gstRate ? `${item.gstRate}%` : '0%'}
                </td>
              )}
              <td className="border border-slate-300 py-1 px-2 text-right font-bold font-mono text-slate-900">
                {Number(item.total).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Financial Totals & Signatures (Compact) */}
      <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-slate-800 text-[10px]">
        {/* Left: Compact Notes & Terms */}
        <div className="space-y-1 text-slate-600">
          <p className="font-bold text-slate-800 uppercase text-[9px]">Terms & Conditions:</p>
          <p className="text-[9px] text-slate-600 leading-tight">
            1. Goods once sold will not be exchanged without original bill. 2. Standard manufacturer warranty applies on branded parts.
          </p>
          {shopSettings.invoiceFooter && (
            <p className="italic text-slate-700 font-medium text-[9px] pt-0.5">
              "{shopSettings.invoiceFooter}"
            </p>
          )}
        </div>

        {/* Right: Calculations (Tight Row Spacing) */}
        <div className="space-y-0.5 text-[11px]">
          <div className="flex justify-between text-slate-700 py-0.5">
            <span>Subtotal:</span>
            <span className="font-mono font-semibold">{currency} {Number(bill.subTotal || 0).toFixed(2)}</span>
          </div>

          {bill.discountAmount > 0 && (
            <div className="flex justify-between text-rose-700 py-0.5">
              <span>Discount:</span>
              <span className="font-mono font-semibold">- {currency} {Number(bill.discountAmount).toFixed(2)}</span>
            </div>
          )}

          {isTaxInvoice && (
            <div className="flex justify-between text-slate-700 py-0.5">
              <span>Total GST:</span>
              <span className="font-mono font-semibold">{currency} {Number(bill.taxAmount).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-900">
            <span>Grand Total:</span>
            <span className="font-mono text-sm">{currency} {Number(bill.grandTotal || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[10px] text-slate-600">
            <span>Paid: {currency} {Number(bill.paidAmount || bill.grandTotal).toFixed(2)}</span>
            {bill.dueAmount > 0 && (
              <span className="font-bold text-rose-700">Due: {currency} {Number(bill.dueAmount).toFixed(2)}</span>
            )}
          </div>

          {/* Compact Signature */}
          <div className="pt-3 text-right">
            <div className="inline-block border-t border-slate-400 pt-0.5 text-center min-w-[120px]">
              <p className="text-[9px] font-bold text-slate-800 uppercase">Authorized Signatory</p>
              <p className="text-[8px] text-slate-500 font-semibold">For {companyName || shopName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-2 pt-1 border-t border-slate-200 text-center text-[9px] text-slate-500">
        <span>Powered by <strong>{companyName}</strong></span>
        {website && <span> • {website}</span>}
      </div>
    </div>
  );
};

export default PrintableInvoice;
