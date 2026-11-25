import { ReactNode } from 'react';

interface SettingsSectionProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'default' | 'warning' | 'danger';
  children: ReactNode;
  id?: string;
}

export default function SettingsSection({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = 'default',
  children,
  id,
}: SettingsSectionProps) {
  const badgeColors = {
    default: { bg: 'rgba(67, 97, 238, 0.1)', color: 'var(--primary)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' },
  };

  const colors = badgeColors[badgeColor];

  return (
    <section className="settings-section" id={id}>
      <div className="settings-section-header">
        <div className="settings-section-icon">
          {icon}
        </div>
        <div className="settings-section-info">
          <div className="settings-section-title-row">
            <h3>{title}</h3>
            {badge && (
              <span 
                className="settings-badge" 
                style={{ background: colors.bg, color: colors.color }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="settings-section-body">
        {children}
      </div>
    </section>
  );
}