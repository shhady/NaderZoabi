export const SITE_NAME = 'משרד רואי חשבון זועבי';
export const SITE_DESCRIPTION = 'פתרונות חשבונאות מקצועיים לעסקים ויחידים';

export const CONTACT_INFO = {
  phone: '054-1234567',
  email: 'info@accountant.co.il',
  address: 'רחוב הרצל 1, תל אביב',
  hours: {
    weekdays: '9:00 - 17:00',
    friday: '9:00 - 13:00',
    saturday: 'סגור'
  }
};

export const NAVIGATION = {
  main: [
    { name: 'שירותים', href: '/services' },
    { name: 'בלוג', href: '/blog' },
    { name: 'צור קשר', href: '/contact' }
  ],
  dashboard: [
    { name: 'לוח בקרה', href: '/dashboard' },
    { name: 'מסמכים', href: '/dashboard/documents' },
    { name: 'העלאת קבצים', href: '/dashboard/files/upload' },
    { name: 'משתמשים', href: '/dashboard/users', adminOnly: true },
    { name: 'בלוג', href: '/dashboard/blog', adminOnly: true }
  ]
}; 