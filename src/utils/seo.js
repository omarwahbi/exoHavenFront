// SEO Utility Functions - JSON-LD Structured Data Generators

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exohaven-iq.com';
const imageKitUrl = 'https://ik.imagekit.io/5a72nvbtu';

/**
 * Generate Organization structured data (JSON-LD)
 * Used on the homepage for local business SEO
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PetStore',
    '@id': `${baseUrl}/#organization`,
    name: 'ExoHaven Iraq | إكزو هيفن',
    alternateName: 'إكزو هيفن',
    url: baseUrl,
    logo: `${baseUrl}/icons/icon-512x512.png`,
    image: `${baseUrl}/og-image.png`,
    description:
      'متجر متخصص في بيع جميع مستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني للطلبات فوق 50,000 دينار عراقي.',
    email: 'exohaven.iq@gmail.com',
    telephone: '+964-783-898-4924',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Baghdad',
      addressLocality: 'Baghdad',
      addressRegion: 'Baghdad',
      addressCountry: 'IQ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.3152,
      longitude: 44.3661,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Iraq',
    },
    priceRange: '$$',
    currenciesAccepted: 'IQD',
    paymentAccepted: 'Cash',
    openingHours: 'Mo-Su 09:00-22:00',
    sameAs: [
      'https://www.instagram.com/exohaven.iq/',
      'https://www.tiktok.com/@exohaven.iq',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Exotic Pets Accessories',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Reptile Accessories',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Exotic Bird Accessories',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Terrarium Supplies',
          },
        },
      ],
    },
  };
}

/**
 * Generate WebSite structured data (JSON-LD)
 * Enables search box in Google search results
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'ExoHaven Iraq | إكزو هيفن',
    description:
      'متجر متخصص في بيع جميع مستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: ['ar-IQ', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Product structured data (JSON-LD)
 * @param {Object} item - Product item from API
 */
export function generateProductSchema(item) {
  if (!item || !item.attributes) return null;

  const {
    name,
    description,
    state,
    out_of_stock,
    item_thumbnail,
    category,
  } = item.attributes;

  // Ensure we have a valid price
  if (!state || typeof state !== 'number') return null;

  // Get image URL
  let imageUrl = `${baseUrl}/icons/icon-512x512.png`; // Default image
  if (item_thumbnail?.data?.attributes?.url) {
    const thumbnailUrl = item_thumbnail.data.attributes.url;
    imageUrl = thumbnailUrl.startsWith('http')
      ? thumbnailUrl
      : `${imageKitUrl}${thumbnailUrl}`;
  }

  // Calculate actual price (10% discount for sale)
  const regularPrice = state;
  const salePrice = regularPrice * 0.9;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/item/${item.id}`,
    name: name || 'Product',
    description: description || 'Exotic pet accessory available at ExoHaven Iraq',
    image: imageUrl,
    sku: `EXOHAVEN-${item.id}`,
    brand: {
      '@type': 'Brand',
      name: 'ExoHaven',
    },
    category: category?.data?.attributes?.name || 'Pet Accessories',
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/item/${item.id}`,
      priceCurrency: 'IQD',
      price: salePrice,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
      itemCondition: 'https://schema.org/NewCondition',
      availability: out_of_stock
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ExoHaven Iraq',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: salePrice >= 50000 ? 0 : 5000,
          currency: 'IQD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IQ',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '1',
    },
  };
}

/**
 * Generate BreadcrumbList structured data (JSON-LD)
 * @param {Array} breadcrumbs - Array of {name, url} objects
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate FAQ structured data (JSON-LD)
 * For FAQ or About pages
 */
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'هل التوصيل مجاني؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، التوصيل مجاني لجميع الطلبات التي تزيد قيمتها عن 50,000 دينار عراقي في جميع أنحاء العراق.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل يمكن الدفع عند الاستلام؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، نوفر خدمة الدفع عند الاستلام لجميع الطلبات.',
        },
      },
      {
        '@type': 'Question',
        name: 'ما هو خصم الطلب عبر الموقع؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نقدم خصم 10% على جميع الطلبات التي يتم إجراؤها عبر الموقع الإلكتروني.',
        },
      },
      {
        '@type': 'Question',
        name: 'ما هي المناطق التي تغطيها خدمة التوصيل؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نوفر خدمة التوصيل إلى جميع مناطق العراق.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of pet accessories do you sell?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We specialize in exotic pet accessories including reptile supplies, bird accessories, terrarium equipment, heating and lighting systems, food, and decorative items for all exotic pets.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is free delivery available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer free delivery throughout Iraq for orders above 50,000 IQD.',
        },
      },
    ],
  };
}

/**
 * Generate ItemList structured data for category/collection pages
 * @param {Array} items - Array of product items
 * @param {string} listName - Name of the collection
 */
export function generateItemListSchema(items, listName = 'Products') {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/item/${item.id}`,
      name: item.attributes?.name || 'Product',
    })),
  };
}

/**
 * Generate LocalBusiness structured data with enhanced details
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['PetStore', 'LocalBusiness', 'Store'],
    '@id': `${baseUrl}/#localbusiness`,
    name: 'ExoHaven Iraq',
    image: `${baseUrl}/og-image.png`,
    description:
      'Leading exotic pets accessories retailer in Iraq. We offer premium quality supplies for reptiles, exotic birds, and other exotic pets with free delivery and cash on delivery options.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Baghdad',
      addressLocality: 'Baghdad',
      addressRegion: 'Baghdad Governorate',
      postalCode: '',
      addressCountry: 'IQ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.3152,
      longitude: 44.3661,
    },
    url: baseUrl,
    telephone: '+964-783-898-4924',
    email: 'exohaven.iq@gmail.com',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '22:00',
      },
    ],
    paymentAccepted: 'Cash on Delivery',
    currenciesAccepted: 'IQD',
    areaServed: [
      {
        '@type': 'City',
        name: 'Baghdad',
      },
      {
        '@type': 'Country',
        name: 'Iraq',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Exotic Pets Accessories Catalog',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Reptile Accessories',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Terrariums & Cages',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Heating & Lighting',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Food & Supplements',
              },
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Exotic Bird Accessories',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bird Cages & Stands',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Bird Food & Treats',
              },
            },
          ],
        },
      ],
    },
  };
}

/**
 * Render JSON-LD script tag (for use in components)
 * @param {Object} schema - Structured data object
 */
export function renderJSONLD(schema) {
  if (!schema) return null;
  return {
    __html: JSON.stringify(schema),
  };
}
