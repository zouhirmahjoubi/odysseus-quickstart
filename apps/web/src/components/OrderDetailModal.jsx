
import React from 'react';
import { X, Package, MapPin, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[hsl(var(--card))] border-[3px] border-[hsl(var(--border-color))] shadow-[8px_8px_0px_0px_hsl(var(--border-color))] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[hsl(var(--card))] border-b-[3px] border-[hsl(var(--border-color))] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black">Order Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--muted))] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Order ID</p>
              <p className="font-bold">{order.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Status</p>
              <span className={`inline-block px-3 py-1 border-[2px] border-[hsl(var(--border-color))] font-bold text-sm ${
                order.status === 'delivered' ? 'bg-green-200' :
                order.status === 'shipped' ? 'bg-blue-200' :
                order.status === 'processing' ? 'bg-yellow-200' :
                order.status === 'cancelled' ? 'bg-red-200' :
                'bg-gray-200'
              }`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Order Date</p>
              <p className="font-bold">{new Date(order.created).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Total</p>
              <p className="font-bold text-lg">${order.total?.toFixed(2)}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} />
              <h3 className="font-black text-lg">Order Items</h3>
            </div>
            <div className="space-y-3">
              {items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b-[2px] border-[hsl(var(--border-color))] last:border-0">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} />
                <h3 className="font-black text-lg">Shipping Address</h3>
              </div>
              <p className="font-bold">{shippingAddress.name}</p>
              <p>{shippingAddress.street}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
            </div>
          )}

          {/* Payment & Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.stripePaymentIntentId && (
              <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={20} />
                  <h3 className="font-black">Payment</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Payment ID</p>
                <p className="font-mono text-xs break-all">{order.stripePaymentIntentId}</p>
              </div>
            )}

            {order.trackingNumber && (
              <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={20} />
                  <h3 className="font-black">Tracking</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{order.shippingCarrier}</p>
                <p className="font-bold">{order.trackingNumber}</p>
              </div>
            )}
          </div>

          {order.estimatedDelivery && (
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Estimated Delivery</p>
              <p className="font-bold">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
            </div>
          )}

          {order.notes && (
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Notes</p>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}

          <Button onClick={onClose} className="neo-button w-full bg-[hsl(var(--muted))]">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
