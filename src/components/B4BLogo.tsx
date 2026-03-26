'use client';

interface B4BLogoProps {
  /** 'sidebar' = bricks only (no cursor, no wordmark), scaled for the nav header
   *  'full'    = cursor + bricks + wordmark, for login / splash screens */
  variant?: 'sidebar' | 'full';
}

export default function B4BLogo({ variant = 'full' }: B4BLogoProps) {
  if (variant === 'sidebar') {
    // Compact bricks-only mark, scaled to ~30 px tall
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ width: 20, height: 9, borderRadius: 2, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)' }} />
          <div style={{ width: 20, height: 9, borderRadius: 2, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)', opacity: 0.4 }} />
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ width: 11, height: 9, borderRadius: 2, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)', opacity: 0.4 }} />
          <div style={{ width: 20, height: 9, borderRadius: 2, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)' }} />
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ width: 20, height: 9, borderRadius: 2, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)', opacity: 0.4 }} />
          <div style={{ width: 11, height: 9, borderRadius: 2, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)' }} />
        </div>
      </div>
    );
  }

  // Full variant: cursor + bricks + wordmark (mirrors b4b_concept_4_cursor.html)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Blinking cursor */}
        <div className="b4b-cursor" />
        {/* Mini bricks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 40, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)' }} />
            <div style={{ width: 40, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)', opacity: 0.4 }} />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 22, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)', opacity: 0.4 }} />
            <div style={{ width: 40, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)' }} />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 40, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)', opacity: 0.4 }} />
            <div style={{ width: 22, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#CCFF00,#7DFFC0,#60CFFF)' }} />
          </div>
        </div>
      </div>
      {/* Wordmark */}
      <div style={{
        fontFamily: 'Syne, Inter, sans-serif',
        fontSize: 13,
        fontWeight: 900,
        color: '#fff',
        letterSpacing: 3,
      }}>
        BRICK4BRICK
      </div>
    </div>
  );
}
