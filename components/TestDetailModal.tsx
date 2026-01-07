'use client';

import Modal from './Modal';

interface TestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: any | null;
}

export default function TestDetailModal({ isOpen, onClose, test }: TestDetailModalProps) {
  if (!test) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '700px',
        width: '100%',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '24px',
        position: 'relative',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              color: '#3b82f6',
              background: 'rgba(59,130,246,0.15)',
              padding: '4px 12px',
              borderRadius: '4px',
            }}>
              {test.id}
            </div>
            <div style={{
              fontSize: '13px',
              color: test.status === 'completed' ? '#1db954' : '#eab308',
              background: test.status === 'completed' ? 'rgba(29,185,84,0.15)' : 'rgba(234,179,8,0.15)',
              padding: '4px 12px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              {test.status}
            </div>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{test.name}</h2>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>{test.hypothesis}</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#888' }}>
            <span>{test.productEmoji} {test.product}</span>
            <span>{test.channelEmoji} {test.channel}</span>
            <span>📅 {test.startDate}</span>
            <span>⏱️ {test.daysRunning} days</span>
          </div>
        </div>

        {/* Winner Banner */}
        {test.testVariant.isWinning && test.status === 'completed' && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(29,185,84,0.15) 0%, rgba(29,185,84,0.05) 100%)',
            border: '1px solid rgba(29,185,84,0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#1db954' }}>
              {test.testVariant.name} WON!
            </h3>
            <p style={{ fontSize: '14px', color: '#b3b3b3' }}>
              Outperformed {test.controlVariant.name} by +{test.deltas.convRate.value.toFixed(2)}% conversion rate with {test.confidence}% confidence
            </p>
          </div>
        )}

        {/* Variants Comparison */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', color: '#888', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase' }}>Variant Comparison</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Test Variant */}
            <div style={{
              background: test.testVariant.isWinning ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.02)',
              border: test.testVariant.isWinning ? '1px solid rgba(29,185,84,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>TEST</div>
                {test.testVariant.isWinning && (
                  <div style={{ background: 'rgba(29,185,84,0.2)', color: '#1db954', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>
                    WINNING
                  </div>
                )}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{test.testVariant.name}</div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>{test.testVariant.lpid}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>Clicks</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{test.testVariant.clicks.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>Sales</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{test.testVariant.sales}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>Conv %</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: test.testVariant.isWinning ? '#1db954' : '#fff' }}>
                    {test.testVariant.convRate.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>EPC</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>${test.testVariant.epc.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Control Variant */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>CONTROL</div>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{test.controlVariant.name}</div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>{test.controlVariant.lpid}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>Clicks</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{test.controlVariant.clicks.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>Sales</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{test.controlVariant.sales}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>Conv %</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>
                    {test.controlVariant.convRate.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#888' }}>EPC</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>${test.controlVariant.epc.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Confidence */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>STATISTICAL CONFIDENCE</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: test.confidence >= 95 ? '#1db954' : test.confidence >= 70 ? '#eab308' : '#888' }}>
              {test.confidence}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${test.confidence}%`,
              height: '100%',
              background: test.confidence >= 95 ? '#1db954' : test.confidence >= 70 ? '#eab308' : '#666',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* TEST SUMMARY - From Original HTML */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <h3 style={{ fontSize: '12px', color: '#888', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            TEST SUMMARY
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Conversion Delta</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: test.deltas.convRate.value >= 0 ? '#1db954' : '#ef4444' }}>
                {test.deltas.convRate.value >= 0 ? '+' : ''}{test.deltas.convRate.value.toFixed(2)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>EPC Delta</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: test.deltas.epc.value >= 0 ? '#1db954' : '#ef4444' }}>
                ${Math.abs(test.deltas.epc.value).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Statistical Confidence</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: test.confidence >= 95 ? '#1db954' : test.confidence >= 70 ? '#eab308' : '#888' }}>
                {test.confidence}%
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED BREAKDOWN TABLE - From Original HTML */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '12px', color: '#888', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            DETAILED BREAKDOWN
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#888', fontWeight: '600', fontSize: '11px' }}>DATE</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#888', fontWeight: '600', fontSize: '11px' }}>LPID</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', color: '#888', fontWeight: '600', fontSize: '11px' }}>CLICKS</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', color: '#888', fontWeight: '600', fontSize: '11px' }}>SALES</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', color: '#888', fontWeight: '600', fontSize: '11px' }}>CONV %</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', color: '#888', fontWeight: '600', fontSize: '11px' }}>EPC</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', color: '#888', fontWeight: '600', fontSize: '11px' }}>AOV</th>
                </tr>
              </thead>
              <tbody>
                {/* Test Variant Row 1 */}
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 8px', color: '#b3b3b3' }}>{test.startDate}</td>
                  <td style={{ padding: '12px 8px', color: '#b3b3b3', fontSize: '12px' }}>{test.testVariant.lpid}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>{test.testVariant.clicks.toLocaleString()}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>{test.testVariant.sales}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '700', color: '#1db954' }}>{test.testVariant.convRate.toFixed(2)}%</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>${test.testVariant.epc.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>${test.testVariant.aov.toFixed(2)}</td>
                </tr>
                {/* Control Variant Row */}
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 8px', color: '#b3b3b3' }}>{test.startDate}</td>
                  <td style={{ padding: '12px 8px', color: '#b3b3b3', fontSize: '12px' }}>{test.controlVariant.lpid}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>{test.controlVariant.clicks.toLocaleString()}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>{test.controlVariant.sales}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '700' }}>{test.controlVariant.convRate.toFixed(2)}%</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>${test.controlVariant.epc.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>${test.controlVariant.aov.toFixed(2)}</td>
                </tr>
                {/* Additional rows for visual completeness */}
                <tr>
                  <td style={{ padding: '12px 8px', color: '#666', fontSize: '12px' }} colSpan={7}>
                    <em>Week {test.daysRunning / 7} of testing • {test.testVariant.clicks + test.controlVariant.clicks} total clicks</em>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

