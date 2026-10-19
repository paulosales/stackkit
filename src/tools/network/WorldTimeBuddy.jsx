import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Clock,
  Globe,
  Plus,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Copy,
  Check,
  CalendarPlus,
  Download,
  Share2,
  Search,
  X,
  ArrowUpDown,
  Sun,
  Moon,
  Briefcase
} from 'lucide-react';

// Comprehensive dataset of world tech hubs and cities
export const CITIES_DATABASE = [
  { id: 'ny', name: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸' },
  { id: 'london', name: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'saopaulo', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'sf', name: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'chicago', name: 'Chicago', country: 'United States', timezone: 'America/Chicago', flag: '🇺🇸' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', flag: '🇨🇦' },
  { id: 'paris', name: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', flag: '🇮🇪' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', flag: '🇵🇹' },
  { id: 'rome', name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭' },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', flag: '🇸🇪' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'hongkong', name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'mumbai', name: 'Mumbai / Delhi', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'beijing', name: 'Beijing / Shanghai', country: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', flag: '🇦🇺' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿' },
  { id: 'buenosaires', name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { id: 'mexicocity', name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽' },
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota', flag: '🇨🇴' },
  { id: 'santiago', name: 'Santiago', country: 'Chile', timezone: 'America/Santiago', flag: '🇨🇱' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬' },
  { id: 'telaviv', name: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', flag: '🇮🇱' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  { id: 'honolulu', name: 'Honolulu', country: 'United States', timezone: 'Pacific/Honolulu', flag: '🇺🇸' },
  { id: 'utc', name: 'UTC / GMT', country: 'Coordinated Universal Time', timezone: 'Etc/UTC', flag: '🌐' }
];

export default function WorldTimeBuddy({ onCopy, lang = 'pt' }) {
  // User's detected local timezone
  const localTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    } catch {
      return 'America/Sao_Paulo';
    }
  }, []);

  // Selected date (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  // Current real-time clock (updates every 10s)
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Format mode: 12h or 24h
  const [is24Hour, setIs24Hour] = useState(false);

  // Active locations in user's timeline
  const [locations, setLocations] = useState(() => {
    // Initial default: Home + New York + London + Tokyo + São Paulo
    const defaultList = [
      {
        id: 'home-loc',
        name: 'Home / Local Time',
        country: 'Seu Fuso Local',
        timezone: localTimezone,
        flag: '🏠',
        isHome: true
      },
      { id: 'ny', name: 'New York', country: 'United States, NY', timezone: 'America/New_York', flag: '🇺🇸', isHome: false },
      { id: 'london', name: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', isHome: false },
      { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', isHome: false },
      { id: 'saopaulo', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', isHome: false }
    ];
    return defaultList;
  });

  // Selected hour scrubber (0 to 23 reference hour on home location)
  const [selectedHour, setSelectedHour] = useState(() => {
    return new Date().getHours();
  });

  // Hovered hour for scrubber guide
  const [hoveredHour, setHoveredHour] = useState(null);

  // Add location modal state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Meeting duration in hours
  const [meetingDuration, setMeetingDuration] = useState(1);
  const [meetingCopied, setMeetingCopied] = useState(false);

  // Helper: Get formatted date and time parts in timezone
  const getTimeInZone = (dateObj, tz) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        hour12: !is24Hour,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      return formatter.format(dateObj);
    } catch {
      return dateObj.toLocaleTimeString();
    }
  };

  // Helper: Get offset string (e.g. "UTC -4", "UTC +3")
  const getGmtOffset = (dateObj, tz) => {
    try {
      const d = dateObj.toLocaleString('en-US', { timeZone: tz });
      const targetTime = new Date(d).getTime();
      const utcTime = new Date(dateObj.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();
      const diffHours = Math.round((targetTime - utcTime) / (1000 * 60 * 60));
      return diffHours >= 0 ? `UTC +${diffHours}` : `UTC ${diffHours}`;
    } catch {
      return 'UTC';
    }
  };

  // Helper: Get short timezone abbreviation (e.g. EST, BST, JST)
  const getTzAbbr = (dateObj, tz) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'short'
      }).formatToParts(dateObj);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      return tzPart ? tzPart.value : '';
    } catch {
      return '';
    }
  };

  // Generate 24 hours of data for each location based on reference day
  const timelineData = useMemo(() => {
    const homeLocation = locations.find(l => l.isHome) || locations[0] || { timezone: localTimezone };
    const [year, month, day] = selectedDate.split('-').map(Number);

    // Reference dates for each hour 0..23 in the home location
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return locations.map(loc => {
      const rowHours = hours.map(h => {
        // Construct reference date in UTC aligning with home timezone hour h
        // Create an ISO timestamp roughly representing home time
        const refDate = new Date(Date.UTC(year, month - 1, day, h, 0, 0));

        // Format parts in target timezone
        let targetHour = h;
        let dayDiff = 0;
        let period = 'AM';
        let displayHour = `${h}:00`;

        try {
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: loc.timezone,
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h23',
            day: 'numeric'
          }).formatToParts(refDate);

          const hVal = Number(parts.find(p => p.type === 'hour')?.value || 0);
          const dVal = Number(parts.find(p => p.type === 'day')?.value || day);
          targetHour = hVal;
          dayDiff = dVal - day;
          if (dayDiff > 1) dayDiff = 1;
          if (dayDiff < -1) dayDiff = -1;

          if (!is24Hour) {
            const h12 = targetHour % 12 || 12;
            period = targetHour >= 12 ? 'pm' : 'am';
            displayHour = `${h12}${period}`;
          } else {
            displayHour = `${String(targetHour).padStart(2, '0')}:00`;
          }
        } catch (err) {
          console.warn(err);
        }

        // Determine if business hour (9:00 - 17:00), sleep/night (22:00 - 06:00), or transition
        let hourType = 'transition';
        if (targetHour >= 9 && targetHour <= 17) {
          hourType = 'business'; // green
        } else if (targetHour >= 22 || targetHour < 7) {
          hourType = 'night'; // dark slate
        } else {
          hourType = 'day'; // neutral
        }

        return {
          referenceHour: h,
          targetHour,
          dayDiff,
          displayHour,
          hourType
        };
      });

      return {
        ...loc,
        currentLiveTime: getTimeInZone(now, loc.timezone),
        gmtOffset: getGmtOffset(now, loc.timezone),
        tzAbbr: getTzAbbr(now, loc.timezone),
        hours: rowHours
      };
    });
  }, [locations, selectedDate, is24Hour, now, localTimezone]);

  // Date Navigation
  const handleShiftDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Set a location as Home
  const handleSetHome = (locId) => {
    setLocations(prev =>
      prev.map(l => ({ ...l, isHome: l.id === locId }))
    );
  };

  // Remove a location
  const handleRemoveLocation = (locId) => {
    if (locations.length <= 1) {
      if (onCopy) onCopy('Mantenha pelo menos uma cidade na lista!');
      return;
    }
    setLocations(prev => prev.filter(l => l.id !== locId));
  };

  // Add location from database
  const handleAddLocation = (city) => {
    if (locations.some(l => l.timezone === city.timezone && l.name === city.name)) {
      if (onCopy) onCopy('Esta cidade já está no seu painel!');
      return;
    }
    const newLoc = {
      id: `loc-${Date.now()}-${city.id}`,
      name: city.name,
      country: city.country,
      timezone: city.timezone,
      flag: city.flag,
      isHome: false
    };
    setLocations(prev => [...prev, newLoc]);
    setSearchModalOpen(false);
    setSearchQuery('');
    if (onCopy) onCopy(`${city.name} adicionado ao World Time Buddy!`);
  };

  // Reorder location up / down
  const handleMoveLocation = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= locations.length) return;
    const copy = [...locations];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setLocations(copy);
  };

  // Generate meeting text for Slack / Email
  const getMeetingText = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const dateFormatted = new Date(year, month - 1, day).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    let text = `📅 Team Meeting Schedule\nDate: ${dateFormatted}\n\n`;

    timelineData.forEach(loc => {
      const startSlot = loc.hours.find(h => h.referenceHour === selectedHour);
      const endSlot = loc.hours.find(h => h.referenceHour === (selectedHour + meetingDuration) % 24);

      if (startSlot) {
        text += `• ${loc.flag} ${loc.name} (${loc.tzAbbr}): ${startSlot.displayHour} - ${endSlot ? endSlot.displayHour : ''} ${loc.gmtOffset}\n`;
      }
    });

    text += `\nShared via StackKit World Time Buddy`;
    return text;
  };

  // Copy meeting info
  const handleCopyMeeting = () => {
    const text = getMeetingText();
    navigator.clipboard.writeText(text);
    setMeetingCopied(true);
    setTimeout(() => setMeetingCopied(false), 2000);
    if (onCopy) onCopy('Detalhes da reunião copiados com sucesso!');
  };

  // Generate Google Calendar Link
  const handleOpenGoogleCalendar = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const startUtc = new Date(Date.UTC(year, month - 1, day, selectedHour, 0, 0));
    const endUtc = new Date(Date.UTC(year, month - 1, day, selectedHour + meetingDuration, 0, 0));

    const toGCalIso = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const datesParam = `${toGCalIso(startUtc)}/${toGCalIso(endUtc)}`;

    const title = encodeURIComponent('Global Team Meeting');
    const details = encodeURIComponent(getMeetingText());
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate & Download iCalendar .ics file
  const handleDownloadIcs = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const startUtc = new Date(Date.UTC(year, month - 1, day, selectedHour, 0, 0));
    const endUtc = new Date(Date.UTC(year, month - 1, day, selectedHour + meetingDuration, 0, 0));

    const toIcsDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//StackKit//WorldTimeBuddy//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART:${toIcsDate(startUtc)}`,
      `DTEND:${toIcsDate(endUtc)}`,
      `SUMMARY:Global Team Meeting`,
      `DESCRIPTION:${getMeetingText().replace(/\n/g, '\\n')}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-${selectedDate}-${selectedHour}h.ics`;
    link.click();
    URL.revokeObjectURL(url);
    if (onCopy) onCopy('Arquivo de convite .ics baixado!');
  };

  // Filter cities in search modal
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_DATABASE;
    const q = searchQuery.toLowerCase();
    return CITIES_DATABASE.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.timezone.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeHighlightedHour = hoveredHour !== null ? hoveredHour : selectedHour;

  return (
    <div className="wtb-container">
      {/* Top Header Controls Bar */}
      <div className="wtb-toolbar">
        {/* Date Selector Navigation */}
        <div className="wtb-date-nav">
          <button
            className="btn-secondary btn-icon"
            onClick={() => handleShiftDate(-1)}
            title="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="btn-secondary"
            onClick={handleSetToday}
            title="Ir para hoje"
          >
            Hoje
          </button>
          <button
            className="btn-secondary btn-icon"
            onClick={() => handleShiftDate(1)}
            title="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>

          <div className="wtb-date-input-wrap">
            <Calendar size={15} className="wtb-calendar-icon" />
            <input
              type="date"
              className="text-input wtb-date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Legend Indicators */}
        <div className="wtb-legend hide-mobile">
          <span className="legend-item">
            <span className="legend-badge business" /> Comercial (9h - 17h)
          </span>
          <span className="legend-item">
            <span className="legend-badge night" /> Noite / Sono
          </span>
        </div>

        {/* Right Tools: 12h/24h toggle & Add Location */}
        <div className="wtb-actions-group">
          {/* 12h / 24h Toggle Button */}
          <div className="btn-group">
            <button
              className={`btn-secondary ${!is24Hour ? 'btn-active-toggle' : ''}`}
              onClick={() => setIs24Hour(false)}
            >
              12h AM/PM
            </button>
            <button
              className={`btn-secondary ${is24Hour ? 'btn-active-toggle' : ''}`}
              onClick={() => setIs24Hour(true)}
            >
              24h
            </button>
          </div>

          {/* Add City Button */}
          <button
            className="btn-primary"
            onClick={() => setSearchModalOpen(true)}
          >
            <Plus size={16} />
            <span>Adicionar Cidade</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Timeline Workspace */}
      <div className="wtb-timeline-board">
        {/* Timeline Header Row with Hours 00 to 23 */}
        <div className="wtb-timeline-header-row">
          <div className="wtb-col-location-header">
            <span>Cidades & Fusos ({timelineData.length})</span>
          </div>

          <div className="wtb-hours-strip-header">
            {Array.from({ length: 24 }, (_, i) => {
              const isSelected = activeHighlightedHour === i;
              const label = !is24Hour
                ? `${i % 12 || 12}${i >= 12 ? 'p' : 'a'}`
                : `${String(i).padStart(2, '0')}`;

              return (
                <div
                  key={i}
                  className={`wtb-hour-header-cell ${isSelected ? 'active-header-cell' : ''}`}
                  onClick={() => setSelectedHour(i)}
                  onMouseEnter={() => setHoveredHour(i)}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* City Rows */}
        <div className="wtb-rows-list">
          {timelineData.map((loc, locIndex) => (
            <div key={loc.id} className={`wtb-city-row ${loc.isHome ? 'is-home-row' : ''}`}>
              {/* City Info Card (Left) */}
              <div className="wtb-city-card">
                <div className="wtb-city-title-row">
                  <span className="wtb-flag">{loc.flag}</span>
                  <strong className="wtb-city-name">{loc.name}</strong>
                  {loc.isHome && (
                    <span className="badge badge-cyan" title="Seu Fuso Horário Principal">
                      <Home size={10} style={{ marginRight: 3 }} /> Local
                    </span>
                  )}
                </div>

                <div className="wtb-city-meta">
                  <span className="wtb-country-name">{loc.country}</span>
                  <span className="wtb-offset-tag">{loc.gmtOffset} · {loc.tzAbbr}</span>
                </div>

                <div className="wtb-live-clock">
                  <Clock size={12} className="live-clock-icon" />
                  <span>{loc.currentLiveTime}</span>
                </div>

                {/* City Actions */}
                <div className="wtb-city-actions">
                  {!loc.isHome && (
                    <button
                      className="city-action-btn"
                      onClick={() => handleSetHome(loc.id)}
                      title="Definir como fuso principal"
                    >
                      <Home size={13} />
                    </button>
                  )}
                  <button
                    className="city-action-btn"
                    onClick={() => handleMoveLocation(locIndex, -1)}
                    disabled={locIndex === 0}
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    className="city-action-btn"
                    onClick={() => handleMoveLocation(locIndex, 1)}
                    disabled={locIndex === timelineData.length - 1}
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                  <button
                    className="city-action-btn delete-btn"
                    onClick={() => handleRemoveLocation(loc.id)}
                    title="Remover cidade"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* 24-Hour Timeline Blocks (Right) */}
              <div className="wtb-hours-cells-strip">
                {loc.hours.map((cell, hIdx) => {
                  const isSelected = activeHighlightedHour === cell.referenceHour;

                  return (
                    <div
                      key={hIdx}
                      className={`wtb-hour-cell ${cell.hourType} ${isSelected ? 'is-selected-cell' : ''}`}
                      onClick={() => setSelectedHour(cell.referenceHour)}
                      onMouseEnter={() => setHoveredHour(cell.referenceHour)}
                      onMouseLeave={() => setHoveredHour(null)}
                      title={`${loc.name}: ${cell.displayHour} (${cell.dayDiff > 0 ? '+1 dia' : cell.dayDiff < 0 ? '-1 dia' : 'mesmo dia'})`}
                    >
                      <span className="wtb-cell-hour-num">{cell.displayHour}</span>

                      {/* Day Diff Badge (+1 dia / -1 dia) */}
                      {cell.dayDiff !== 0 && (
                        <span className={`wtb-day-diff-badge ${cell.dayDiff > 0 ? 'next-day' : 'prev-day'}`}>
                          {cell.dayDiff > 0 ? '+1d' : '-1d'}
                        </span>
                      )}

                      {/* Time-of-day Icon hint on hover/business */}
                      {cell.hourType === 'night' && (
                        <Moon size={10} className="cell-type-icon night-icon" />
                      )}
                      {cell.hourType === 'business' && (
                        <Briefcase size={10} className="cell-type-icon work-icon" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Planner & Synchronized Time Summary Bar */}
      <div className="wtb-meeting-planner-bar">
        <div className="meeting-summary-left">
          <div className="meeting-time-lead">
            <Clock size={18} className="text-cyan" />
            <div>
              <div className="meeting-title">Horário Selecionado para Reunião</div>
              <div className="meeting-date-display">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="meeting-duration-control">
            <label>Duração:</label>
            <select
              className="select-input"
              value={meetingDuration}
              onChange={(e) => setMeetingDuration(Number(e.target.value))}
            >
              <option value={1}>1 hora</option>
              <option value={2}>2 horas</option>
              <option value={3}>3 horas</option>
              <option value={4}>4 horas</option>
            </select>
          </div>
        </div>

        {/* Converted times mini pill badges */}
        <div className="meeting-time-chips">
          {timelineData.map(loc => {
            const slot = loc.hours.find(h => h.referenceHour === selectedHour);
            if (!slot) return null;
            return (
              <div key={loc.id} className="meeting-chip">
                <span className="chip-flag">{loc.flag}</span>
                <span className="chip-city">{loc.name}:</span>
                <strong className="chip-time">{slot.displayHour}</strong>
                {slot.dayDiff !== 0 && (
                  <span className="chip-diff">{slot.dayDiff > 0 ? '(+1 dia)' : '(-1 dia)'}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Copy, Google Calendar, iCal */}
        <div className="meeting-actions">
          <button
            className="btn-secondary"
            onClick={handleCopyMeeting}
            title="Copiar lista de horários para Slack ou E-mail"
          >
            {meetingCopied ? <Check size={16} /> : <Copy size={16} />}
            <span>{meetingCopied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            className="btn-secondary"
            onClick={handleOpenGoogleCalendar}
            title="Adicionar evento no Google Calendar"
          >
            <CalendarPlus size={16} />
            <span>Google Calendar</span>
          </button>

          <button
            className="btn-primary"
            onClick={handleDownloadIcs}
            title="Baixar arquivo .ics para Outlook/Apple Calendar"
          >
            <Download size={16} />
            <span>Baixar .ICS</span>
          </button>
        </div>
      </div>

      {/* Add City Search Modal */}
      {searchModalOpen && (
        <div className="modal-overlay" onClick={() => setSearchModalOpen(false)}>
          <div className="modal-container wtb-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Globe size={20} className="text-cyan" />
                <h3>Adicionar Cidade / Fuso Horário</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSearchModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="wtb-search-box">
              <Search size={16} className="search-box-icon" />
              <input
                type="text"
                className="text-input wtb-search-input"
                placeholder="Buscar por cidade, país ou fuso (ex: New York, Paris, Sydney)..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="wtb-cities-results-list custom-scrollbar">
              {filteredCities.map(city => {
                const isAlreadyAdded = locations.some(l => l.timezone === city.timezone && l.name === city.name);
                const currentPreviewTime = getTimeInZone(now, city.timezone);
                const offset = getGmtOffset(now, city.timezone);

                return (
                  <div
                    key={city.id}
                    className={`wtb-city-search-item ${isAlreadyAdded ? 'already-added' : ''}`}
                    onClick={() => !isAlreadyAdded && handleAddLocation(city)}
                  >
                    <div className="city-item-left">
                      <span className="search-flag">{city.flag}</span>
                      <div className="search-city-details">
                        <strong className="search-city-name">{city.name}</strong>
                        <span className="search-country-name">{city.country} · {city.timezone}</span>
                      </div>
                    </div>

                    <div className="city-item-right">
                      <span className="search-city-time">{currentPreviewTime}</span>
                      <span className="search-city-offset">{offset}</span>
                      {isAlreadyAdded ? (
                        <span className="already-badge">Adicionado</span>
                      ) : (
                        <button className="btn-secondary btn-sm">
                          <Plus size={14} /> Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
