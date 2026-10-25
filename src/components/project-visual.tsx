import {
  Bell,
  Check,
  CheckCheck,
  Code2,
  GitPullRequest,
  Hash,
  Send,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import type { Project } from "@/content/portfolio";

export function ProjectVisual({ type }: { type: Project["visual"] }) {
  return (
    <div className={`project-visual visual-${type}`} aria-hidden="true">
      <div className="preview-glow" />
      {type === "review" && (
        <div className="preview-window review-window">
          <div className="preview-bar">
            <span className="preview-logo">
              <Code2 size={14} />
            </span>
            <span>devlens</span>
            <span className="preview-bar-right">
              <GitPullRequest size={12} /> #24
            </span>
          </div>
          <div className="preview-body">
            <div className="preview-code">
              <span>
                12{" "}
                <code>
                  <b>async function</b> getUser(id) {"{"}
                </code>
              </span>
              <span className="code-addition">
                13{" "}
                <code>
                  + &nbsp;<b>if</b> (!id) <b>return</b> null;
                </code>
              </span>
              <span>
                14{" "}
                <code>
                  &nbsp; <b>return await</b> db.find(id);
                </code>
              </span>
              <span>
                15 <code>{"}"}</code>
              </span>
            </div>
            <div className="preview-review">
              <Sparkles size={13} />
              <div>
                <strong>Handle missing input</strong>
                <span>A safer path before the database call.</span>
              </div>
              <Check size={12} />
            </div>
          </div>
        </div>
      )}
      {type === "tracker" && (
        <div className="preview-window tracker-window">
          <div className="preview-bar">
            <span className="preview-logo">
              <TrendingDown size={14} />
            </span>
            <span>price tracker</span>
            <span className="preview-bar-right">Monitoring</span>
          </div>
          <div className="preview-body">
            <div className="tracker-heading">
              <div>
                <span className="preview-muted">Everyday headphones</span>
                <strong>
                  ₹2,499 <small>₹3,499</small>
                </strong>
              </div>
              <span className="price-badge">↓ 28%</span>
            </div>
            <svg
              className="tracker-chart"
              viewBox="0 0 280 60"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0 15h280M0 45h280"
                stroke="#2b3943"
                strokeDasharray="3 5"
              />
              <path
                d="m0 10 35 6 25-3 35 16 30-5 35 15 30-4 25 17 65 0"
                stroke="#92b8cf"
                strokeWidth="2"
              />
              <circle cx="275" cy="52" r="3" fill="#92b8cf" />
            </svg>
            <div className="tracker-alert">
              <Bell size={11} />
              <span>Target reached. Email sent.</span>
              <Check size={11} />
            </div>
          </div>
        </div>
      )}
      {type === "chat" && (
        <div className="preview-window chat-window">
          <div className="preview-bar">
            <span className="preview-logo">
              <Hash size={14} />
            </span>
            <span>the-build-room</span>
            <span className="preview-bar-right">
              <span className="status-dot" /> Live
            </span>
          </div>
          <div className="preview-body">
            <div className="chat-line">
              <span className="chat-avatar">S</span>
              <span>Hey, welcome to the room.</span>
            </div>
            <div className="chat-line outgoing">
              <span>Good to be here 👋</span>
            </div>
            <span className="chat-delivered">
              <CheckCheck size={10} /> Delivered in real time
            </span>
            <div className="chat-compose">
              <span>Message the room…</span>
              <Send size={12} />
            </div>
          </div>
        </div>
      )}
      <span className="visual-caption">ILLUSTRATIVE PREVIEW</span>
    </div>
  );
}
