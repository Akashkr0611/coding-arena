import { useState, useEffect } from 'react';
import { Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function sortTripByDistance(trip: any[]) {
  if (trip.length <= 1) return trip;
  let sorted = [trip[0]];
  let remaining = trip.slice(1);
  
  while (remaining.length > 0) {
    let last = sorted[sorted.length - 1];
    let nearestIdx = 0;
    let minDistance = calculateDistance(last.lat, last.lon, remaining[0].lat, remaining[0].lon);
    
    for (let i = 1; i < remaining.length; i++) {
      let dist = calculateDistance(last.lat, last.lon, remaining[i].lat, remaining[i].lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }
    sorted.push(remaining[nearestIdx]);
    remaining.splice(nearestIdx, 1);
  }
  return sorted;
}

export default function TripPlanner() {
  const [trip, setTrip] = useState<any[]>([]);
  const [param1, setParam1] = useState<string>('Suitability Score');
  const [param2, setParam2] = useState<string>('Temperature');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('trip') || '[]');
    const sorted = sortTripByDistance(saved);
    setTrip(sorted);
  }, []);

  const removeBeach = (id: number) => {
    const updated = trip.filter(t => t.id !== id);
    setTrip(updated);
    localStorage.setItem('trip', JSON.stringify(updated));
  };

  const handleExport = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // PAGE 1 ── Header banner
    doc.setFillColor(11, 18, 32);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CoastWise India', 14, 18);
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Personalised Beach Itinerary', 14, 27);
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(9);
    doc.text(`Generated on: ${today}`, pageWidth - 14, 27, { align: 'right' });

    // Summary
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.text(`Total beaches planned: ${trip.length}`, 14, 50);

    // Itinerary table
    const tableBody = trip.map((beach, idx) => [
      `Day ${idx + 1}`, beach.name, beach.state || beach.location || 'N/A',
      `${28 + (beach.id % 5)}°C`, `${(0.5 + (beach.id % 4) * 0.3).toFixed(1)} m`,
      `${5 + (beach.id % 4)}`, beach.id % 2 === 0 ? 'Low' : 'Moderate',
    ]);
    autoTable(doc, {
      startY: 56,
      head: [['Day', 'Beach', 'State', 'Temp', 'Waves', 'UV', 'Crowd']],
      body: tableBody,
      headStyles: { fillColor: [11, 18, 32], textColor: [56, 189, 248], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      styles: { cellPadding: 4, lineColor: [220, 220, 220], lineWidth: 0.2 },
      columnStyles: { 0: { cellWidth: 16, halign: 'center' }, 1: { cellWidth: 48, fontStyle: 'bold' }, 3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' }, 6: { halign: 'center' } },
    });

    // Tips box
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(14, finalY, pageWidth - 28, 30, 3, 3, 'F');
    doc.setTextColor(56, 189, 248); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Travel Tips', 18, finalY + 9);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
    doc.text('• Always check local safety flags before entering the water.', 18, finalY + 17);
    doc.text('• Carry sufficient sunscreen (SPF 50+) and stay hydrated.', 18, finalY + 23);
    doc.text('• Best time to visit most Indian beaches is October – March.', 18, finalY + 29);
    doc.setFontSize(8); doc.setTextColor(156, 163, 175);
    doc.text('Powered by CoastWise India  |  coastwise.in', pageWidth / 2, 290, { align: 'center' });

    // PAGE 2 ── Graphical Comparison
    doc.addPage();
    doc.setFillColor(11, 18, 32);
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setTextColor(56, 189, 248); doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    doc.text('Beach Comparison Charts', 14, 18);
    doc.setTextColor(156, 163, 175); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Visual analysis across key metrics', 14, 25);

    const metrics = [
      { label: 'Suitability Score (/100)', max: 100, barColor: '#38bdf8', getData: (b: any) => b.id % 3 === 0 ? 45 : 85 },
      { label: 'Temperature (°C)',         max: 45,  barColor: '#f59e0b', getData: (b: any) => 28 + (b.id % 5) },
      { label: 'Wave Height (m)',           max: 4,   barColor: '#ef4444', getData: (b: any) => b.id % 3 === 0 ? 2.5 : 1.2 },
      { label: 'UV Index',                  max: 12,  barColor: '#8b5cf6', getData: (b: any) => 5 + (b.id % 4) },
    ];

    const BEACH_COLORS = ['#38bdf8','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#22c55e','#fb923c'];
    const CW = 900, CH = 420;
    const pdfCW = (pageWidth - 28 - 10) / 2;
    const pdfCH = 62;

    metrics.forEach((metric, mIdx) => {
      const col = mIdx % 2;
      const row = Math.floor(mIdx / 2);
      const xOff = 14 + col * (pdfCW + 10);
      const yOff = 34 + row * (pdfCH + 20);

      const canvas = document.createElement('canvas');
      canvas.width = CW; canvas.height = CH;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CW, CH);

      // Chart title
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 26px Arial';
      ctx.fillText(metric.label, 14, 38);

      const PL = 60, PR = 20, PT = 60, PB = 75;
      const gW = CW - PL - PR, gH = CH - PT - PB;
      const n = Math.max(trip.length, 1);
      const slotW = gW / n;
      const barW = Math.min(slotW * 0.55, 100);

      // Horizontal gridlines
      [0, 0.25, 0.5, 0.75, 1].forEach(frac => {
        const yg = PT + gH - frac * gH;
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(PL, yg); ctx.lineTo(PL + gW, yg); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '17px Arial'; ctx.textAlign = 'right';
        ctx.fillText(String(+(metric.max * frac).toFixed(1)), PL - 8, yg + 6);
      });

      // Bars
      trip.forEach((beach, bIdx) => {
        const val = metric.getData(beach);
        const frac = Math.min(val / metric.max, 1);
        const bH = Math.max(frac * gH, 4);
        const x = PL + bIdx * slotW + (slotW - barW) / 2;
        const y = PT + gH - bH;

        const grad = ctx.createLinearGradient(x, y, x, y + bH);
        const bc = BEACH_COLORS[bIdx % BEACH_COLORS.length];
        grad.addColorStop(0, bc); grad.addColorStop(1, bc + '55');
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, barW, bH, [6, 6, 0, 0]);
        else ctx.rect(x, y, barW, bH);
        ctx.fill();

        // Value label
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center';
        ctx.fillText(String(val), x + barW / 2, Math.max(y - 10, PT + 22));

        // Beach name (truncated)
        ctx.fillStyle = '#94a3b8'; ctx.font = '16px Arial';
        const lbl = beach.name.length > 10 ? beach.name.slice(0, 9) + '…' : beach.name;
        ctx.fillText(lbl, x + barW / 2, CH - 14);
        ctx.textAlign = 'left';
      });

      doc.addImage(canvas.toDataURL('image/png'), 'PNG', xOff, yOff, pdfCW, pdfCH);
      doc.setDrawColor(30, 41, 59); doc.setLineWidth(0.3);
      doc.rect(xOff, yOff, pdfCW, pdfCH);
    });

    doc.setFontSize(8); doc.setTextColor(156, 163, 175);
    doc.text('Powered by CoastWise India  |  coastwise.in', pageWidth / 2, 290, { align: 'center' });

    doc.save('CoastWise_Itinerary.pdf');
  };


  const parameters = [
    { label: 'Suitability Score', key: 'Suitability Score', max: 100, color: '#38bdf8' },
    { label: 'Temperature (°C)', key: 'Temperature', max: 50, color: '#f59e0b' },
    { label: 'Wind Speed (km/h)', key: 'Wind Speed', max: 50, color: '#10b981' },
    { label: 'Wave Height (m)', key: 'Wave Height', max: 5, color: '#ef4444' },
    { label: 'Tide Level (m)', key: 'Tide Level', max: 5, color: '#8b5cf6' },
    { label: 'UV Index', key: 'UV Index', max: 15, color: '#ec4899' },
    { label: 'None', key: 'None', max: 1, color: 'transparent' }
  ];

  const getParamData = (beach: any, key: string) => {
    const uv = 5 + (beach.id % 3);
    const isRisky = beach.id % 3 === 0;
    
    switch (key) {
      case 'Suitability Score': return isRisky ? 45 : 85;
      case 'Temperature': return 28 + (beach.id % 5);
      case 'Wind Speed': return 10 + (beach.id % 15);
      case 'Wave Height': return isRisky ? 2.5 : 1.2;
      case 'Tide Level': return 1.5;
      case 'UV Index': return uv;
      default: return 0;
    }
  };

  const param1Config = parameters.find(p => p.key === param1) || parameters[0];
  const param2Config = parameters.find(p => p.key === param2) || parameters[6];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="header-title" style={{ margin: 0 }}>Trip Planner</h1>
        <button
          onClick={handleExport}
          disabled={trip.length === 0}
          style={{
            background: trip.length === 0 ? '#334155' : '#38bdf8',
            color: trip.length === 0 ? '#64748b' : '#0f172a',
            border: 'none', padding: '10px 20px', borderRadius: '8px',
            cursor: trip.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 className="header-subtitle" style={{ color: 'white', marginBottom: '16px' }}>Selected Beaches</h3>
          {trip.length === 0 ? <p style={{ color: '#94a3b8' }}>No beaches added to your trip yet.</p> : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {trip.map((beach, idx) => (
              <div key={beach.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
                <div>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold', marginRight: '8px' }}>Day {idx + 1}</span>
                  <strong>{beach.name}</strong>
                  <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '8px' }}>{beach.state || beach.location || 'Unknown'}</span>
                </div>
                <button onClick={() => removeBeach(beach.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="header-subtitle" style={{ color: 'white', marginBottom: '16px' }}>Comparison Table</h3>
          <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Beach Name</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>State</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Temperature</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Wind Speed</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Wave Height</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Tide Level</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>UV Index</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Crowd Level</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Suitability</th>
                  <th style={{ padding: '16px', color: '#9ca3af' }}>Safety</th>
                </tr>
              </thead>
              <tbody>
                {trip.map((beach, index) => {
                  const uv = getParamData(beach, 'UV Index');
                  const crowd = beach.id % 3 === 0 ? 'High' : beach.id % 2 === 0 ? 'Moderate' : 'Low';
                  const isRisky = beach.id % 3 === 0;
                  const rowBg = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)';

                  return (
                    <tr key={beach.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: rowBg }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>{beach.name}</td>
                      <td style={{ padding: '16px', color: '#9ca3af' }}>{beach.state || beach.location || 'Unknown'}</td>
                      <td style={{ padding: '16px' }}>{getParamData(beach, 'Temperature')}°C</td>
                      <td style={{ padding: '16px', color: isRisky ? '#ef4444' : '#10b981' }}>
                        {isRisky ? 'High ' : 'Low '}({getParamData(beach, 'Wind Speed')} km/h)
                      </td>
                      <td style={{ padding: '16px', color: isRisky ? '#ef4444' : '#10b981' }}>
                        {getParamData(beach, 'Wave Height')}m
                      </td>
                      <td style={{ padding: '16px' }}>~1.5m</td>
                      <td style={{ padding: '16px' }}>
                        <span className="badge" style={{ background: uv > 5 ? '#ef444420' : '#10b98120', color: uv > 5 ? '#ef4444' : '#10b981' }}>
                          {uv} ({uv > 5 ? 'High' : 'Mod'})
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className="badge" style={{ background: crowd === 'High' ? '#ef444420' : crowd === 'Moderate' ? '#f59e0b20' : '#10b98120', color: crowd === 'High' ? '#ef4444' : crowd === 'Moderate' ? '#f59e0b' : '#10b981' }}>
                          {crowd === 'High' ? '🔴' : crowd === 'Moderate' ? '🟡' : '🟢'} {crowd}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: isRisky ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                        {getParamData(beach, 'Suitability Score')}/100
                      </td>
                      <td style={{ padding: '16px', color: isRisky ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                        {isRisky ? 'Warning' : 'Safe'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h3 className="header-subtitle" style={{ color: 'white', marginTop: '32px', marginBottom: '16px' }}>Graphical Analysis</h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#9ca3af' }}>Parameter 1:</span>
                <select 
                  value={param1} 
                  onChange={e => setParam1(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', outline: 'none' }}
                >
                  {parameters.filter(p => p.key !== 'None').map(p => (
                    <option key={p.key} value={p.key} style={{ background: '#111827' }}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#9ca3af' }}>Compare With:</span>
                <select 
                  value={param2} 
                  onChange={e => setParam2(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', outline: 'none' }}
                >
                  {parameters.map(p => (
                    <option key={p.key} value={p.key} style={{ background: '#111827' }}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: param1Config.color, borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{param1Config.label}</span>
                </div>
                {param2 !== 'None' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: param2Config.color, borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>{param2Config.label}</span>
                  </div>
                )}
              </div>
            </div>
            
            {trip.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '250px', gap: '16px', paddingTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {trip.map((beach) => {
                  const val1 = getParamData(beach, param1);
                  const val2 = param2 !== 'None' ? getParamData(beach, param2) : 0;
                  
                  // Highlight highest logic can be added here if needed

                  return (
                    <div key={beach.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', width: '100%', justifyContent: 'center', height: '100%' }}>
                        <div 
                          style={{ width: '30px', height: `${(val1 / param1Config.max) * 100}%`, background: param1Config.color, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.3s' }} 
                          title={`${param1Config.label}: ${val1}`}
                        >
                          <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', fontWeight: 'bold' }}>{val1}</span>
                        </div>
                        {param2 !== 'None' && (
                          <div 
                            style={{ width: '30px', height: `${(val2 / param2Config.max) * 100}%`, background: param2Config.color, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.3s' }} 
                            title={`${param2Config.label}: ${val2}`}
                          >
                            <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', fontWeight: 'bold' }}>{val2}</span>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px', textAlign: 'center', maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={beach.name}>
                        {beach.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>Add beaches to see the analysis graph.</p>
            )}
          </div>
          
          <div className="card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', marginTop: '24px' }}>
            <h4 style={{ color: '#34d399', margin: '0 0 8px 0' }}>Smart Insights</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#a7f3d0' }}>
              Your itinerary has been automatically sorted using the Haversine formula to find the shortest nearest-neighbor route. Review the safety parameters above before your trip.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
