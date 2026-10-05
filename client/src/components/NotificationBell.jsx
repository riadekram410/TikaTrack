import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./NotificationBell.css";

 const API = import.meta.env.VITE_API_URL;

const DAY = 1000 * 60 * 60 * 24;

const daysUntil = (date) => {
  const today = new Date();
  const due = new Date(date);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return Math.round((due - today) / DAY);
};

const dueText = (days) => {
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days === -1) return "1 day overdue";
  if (days < 0) return `${Math.abs(days)} days overdue`;

  return `Due in ${days} days`;
};

// Bell icon with live badge + dropdown of overdue / due-soon vaccines.
// `className` keeps each page's own topbar bell styling.
function NotificationBell({ className = "" }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  const wrapRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`${API}/schedules`, {
          credentials: "include",
        });

        if (!response.ok) return;

        const data = await response.json();

        const urgent = (data.schedules || [])
          .filter((s) => s.status !== "Completed")
          .map((s) => ({ ...s, days: daysUntil(s.date) }))
          .filter((s) => s.days <= 30)
          .sort((a, b) => a.days - b.days);

        if (!cancelled) setItems(urgent);
      } catch {
        // bell is optional UI - fail silently
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  const overdueCount = items.filter((i) => i.days < 0).length;

  return (
    <div className="nb-wrap" ref={wrapRef}>
      <button
        type="button"
        className={className}
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
      >
        ♧
        {items.length > 0 && <span></span>}
      </button>

      {open && (
        <div className="nb-dropdown">
          <div className="nb-header">
            <strong>Notifications</strong>

            {items.length > 0 && (
              <small>
                {items.length} pending
                {overdueCount > 0 &&
                  ` · ${overdueCount} overdue`}
              </small>
            )}
          </div>

          {items.length === 0 ? (
            <div className="nb-empty">
              You're all caught up 🎉
            </div>
          ) : (
            <ul className="nb-list">
              {items.slice(0, 5).map((item) => (
                <li key={item._id}>
                  <button
                    type="button"
                    className={`nb-item ${
                      item.days < 0 ? "overdue" : ""
                    }`}
                    onClick={() => {
                      setOpen(false);

                      navigate(
                        `/schedule?child=${
                          item.childId?._id || item.childId
                        }`
                      );
                    }}
                  >
                    <span className="nb-item-icon">💉</span>

                    <span className="nb-item-text">
                      <strong>
                        {item.childId?.name || "Child"} ·{" "}
                        {item.name}
                      </strong>

                      <small>{dueText(item.days)}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className="nb-footer"
            onClick={() => {
              setOpen(false);
              navigate("/reminders");
            }}
          >
            View all reminders →
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;