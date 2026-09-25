import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Clock, Edit2, Trash2, Calendar } from "lucide-react";

const REPEAT_OPTIONS = [
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays only" },
  { value: "weekends", label: "Weekends only" },
  { value: "custom", label: "Custom" },
];

function ScheduleForm({ initial, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(
    initial || { startTime: "06:00", durationMinutes: 20, repeat: "daily", enabled: true }
  );

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="schedule-form">
      <div className="form-field">
        <label className="form-label" htmlFor="schedule-time">Start time</label>
        <input
          id="schedule-time"
          type="time"
          className="form-input"
          value={form.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="schedule-duration">Duration ({t("minutes")})</label>
        <input
          id="schedule-duration"
          type="number"
          className="form-input"
          min={1}
          max={120}
          value={form.durationMinutes}
          onChange={(e) => handleChange("durationMinutes", Number(e.target.value))}
        />
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="schedule-repeat">Repeat</label>
        <select
          id="schedule-repeat"
          className="form-input"
          value={form.repeat}
          onChange={(e) => handleChange("repeat", e.target.value)}
        >
          {REPEAT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="schedule-form__actions">
        <button id="btn-save-schedule" className="btn btn--primary btn--full" onClick={() => onSave(form)}>
          Save Schedule
        </button>
        <button id="btn-cancel-schedule" className="btn btn--ghost btn--full" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function IrrigationSchedule({ schedules, onAdd, onUpdate, onDelete }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const formatTime = (tStr) => {
    const [h, m] = tStr.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour < 12 ? "AM" : "PM"}`;
  };

  const handleSave = (form) => {
    if (editingId) {
      onUpdate(editingId, form);
      setEditingId(null);
    } else {
      onAdd(form);
    }
    setShowForm(false);
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <Calendar size={20} strokeWidth={2} />
        {t("irrigation_schedule")}
      </h2>

      {schedules.length === 0 && !showForm && (
        <p className="empty-text">No schedules set. Add one below.</p>
      )}

      {schedules.map((s) =>
        editingId === s.id ? (
          <ScheduleForm
            key={s.id}
            initial={s}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={s.id} className="schedule-item">
            <div className="schedule-item__info">
              <Clock size={16} strokeWidth={2} color="var(--green-600)" />
              <div>
                <span className="schedule-item__time">{formatTime(s.startTime)}</span>
                <span className="schedule-item__detail">
                  {s.durationMinutes} min · {REPEAT_OPTIONS.find((o) => o.value === s.repeat)?.label || s.repeatLabel}
                </span>
              </div>
            </div>
            <div className="schedule-item__actions">
              <button
                id={`btn-edit-schedule-${s.id}`}
                className="icon-btn"
                onClick={() => { setEditingId(s.id); setShowForm(false); }}
                aria-label="Edit schedule"
              >
                <Edit2 size={16} />
              </button>
              <button
                id={`btn-delete-schedule-${s.id}`}
                className="icon-btn icon-btn--danger"
                onClick={() => onDelete(s.id)}
                aria-label="Delete schedule"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )
      )}

      {showForm && !editingId && (
        <ScheduleForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!showForm && !editingId && (
        <button
          id="btn-add-schedule"
          className="btn btn--outline btn--full"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> {t("add_schedule")}
        </button>
      )}
    </div>
  );
}
