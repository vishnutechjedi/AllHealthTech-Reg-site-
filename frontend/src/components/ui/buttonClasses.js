/** Shared Frost & Navy gradient button classes for Button + Link CTAs */

export const btnBase =
  'btn-gradient relative inline-flex items-center justify-center gap-2 font-[var(--font-body)] font-medium select-none min-h-[44px]'

export const btnVariants = {
  primary: 'btn-gradient-primary active:scale-[0.98]',
  secondary: 'btn-gradient-secondary active:scale-[0.98]',
  ghost: 'btn-gradient-ghost active:scale-[0.98]',
  'ghost-on-dark': 'btn-gradient-ghost-dark active:scale-[0.98]',
  outline: 'btn-gradient-outline active:scale-[0.98]',
  navy: 'btn-gradient-navy active:scale-[0.98]',
  accent: 'btn-gradient-accent active:scale-[0.98]',
  danger: 'btn-gradient-danger active:scale-[0.98]',
  inverse: 'btn-gradient-inverse active:scale-[0.98]',
  'filter-active': 'btn-gradient-filter-active',
}

export const btnSizes = {
  sm: 'px-4 py-2 text-xs rounded-[var(--radius-pill)]',
  md: 'px-5 py-2.5 text-[13px] rounded-[var(--radius-pill)]',
  lg: 'px-6 py-3 text-sm rounded-[var(--radius-pill)]',
  xl: 'px-8 py-4 text-base rounded-[var(--radius-pill)]',
}

export const btnDisabled =
  'btn-gradient-disabled !bg-[var(--color-disabled-bg)] !text-[var(--color-disabled-text)] !border-[var(--color-disabled-bg)] cursor-not-allowed hover:!transform-none hover:!shadow-none active:!scale-100'

/** Pre-composed link/button class strings */
export const linkBtn = {
  primary: `${btnBase} ${btnVariants.primary} ${btnSizes.lg}`,
  primaryMd: `${btnBase} ${btnVariants.primary} ${btnSizes.md}`,
  ghostOnDark: `${btnBase} ${btnVariants['ghost-on-dark']} ${btnSizes.lg}`,
  ghostOnDarkMd: `${btnBase} ${btnVariants['ghost-on-dark']} ${btnSizes.md}`,
  inverse: `${btnBase} ${btnVariants.inverse} ${btnSizes.lg}`,
  filterActive: `${btnBase} ${btnVariants['filter-active']} px-4 py-2 text-sm`,
}
