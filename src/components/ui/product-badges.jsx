import React from 'react';
import { Badge } from './badge';

export function SaleBadge({ discount, className, ...props }) {
  return (
    <Badge variant="sale" className={className} {...props}>
      {discount ? `${discount}% OFF` : 'SALE'}
    </Badge>
  );
}

export function NewArrivalBadge({ className, ...props }) {
  return (
    <Badge variant="new" className={className} {...props}>
      NEW
    </Badge>
  );
}

export function StockBadge({ inStock, quantity, className, ...props }) {
  if (inStock === false || quantity === 0) {
    return (
      <Badge variant="outOfStock" className={className} {...props}>
        OUT OF STOCK
      </Badge>
    );
  }

  if (quantity && quantity < 5) {
    return (
      <Badge variant="sale" size="sm" className={className} {...props}>
        LOW STOCK
      </Badge>
    );
  }

  return (
    <Badge variant="stock" size="sm" className={className} {...props}>
      IN STOCK
    </Badge>
  );
}

export function FeaturedBadge({ className, ...props }) {
  return (
    <Badge variant="featured" className={className} {...props}>
      FEATURED
    </Badge>
  );
}

export function ExpertPickBadge({ className, ...props }) {
  return (
    <Badge variant="expert" className={className} {...props}>
      EXPERT PICK
    </Badge>
  );
}

export function DiscountBadge({ amount, type = 'percentage', className, ...props }) {
  const displayText = type === 'percentage' ? `${amount}% OFF` : `-$${amount}`;

  return (
    <Badge variant="sale" size="sm" className={className} {...props}>
      {displayText}
    </Badge>
  );
}
