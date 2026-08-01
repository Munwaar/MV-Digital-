import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone, HiCheckCircle } from 'react-icons/hi';
import { CONTACT, STUDIO, SOCIALS } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useMagnetic } from '@/hooks/useMagnetic';
import { EASE_OUT_QUINT } from '@/lib/utils';

interface FormState {
  name: string;
  email: string;
  budget: string;
  message: string;
}

const BUDGET_OPTIONS = ['Under $10k', '$10k – $30k', '$30k – $75k', '$75k+'];

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', budget: BUDGET_OPTIONS[0], message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const submitRef = useMagnetic<HTMLButtonElement>(0.25);

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (form.message.trim().length < 10) next.message = 'Tell us a little more about the project.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  }

  return (
    <section id="contact" className="relative w-full px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:gap-10">
        <div>
          <SectionHeading eyebrow={CONTACT.eyebrow} lines={CONTACT.heading} />
          <p className="mt-8 max-w-md text-lg font-light leading-relaxed text-paper-dim">{CONTACT.body}</p>

          <div className="mt-10 space-y-4">
            <a href={`mailto:${STUDIO.email}`} data-cursor="link" className="flex items-center gap-3 text-paper transition-colors hover:text-molten">
              <HiOutlineMail className="text-molten" /> {STUDIO.email}
            </a>
            <a href={`tel:${STUDIO.phonePrimary.replace(/\s+/g, '')}`} data-cursor="link" className="flex items-center gap-3 text-paper transition-colors hover:text-molten">
              <HiOutlinePhone className="text-molten" /> {STUDIO.phonePrimary}
            </a>
            <a href={`tel:${STUDIO.phoneSecondary.replace(/\s+/g, '')}`} data-cursor="link" className="flex items-center gap-3 text-paper-dim transition-colors hover:text-molten">
              <HiOutlinePhone className="text-molten" /> {STUDIO.phoneSecondary}
            </a>
            <div className="flex items-center gap-3 text-paper-dim">
              <HiOutlineLocationMarker className="text-molten" /> {STUDIO.location}
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="rounded-full border border-line px-4 py-2 font-mono text-[0.65rem] tracking-widest text-paper-dim transition-colors hover:border-molten hover:text-molten"
              >
                {social.label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
          className="relative overflow-hidden rounded-2xl border border-line bg-ink-2 p-8 md:p-10"
        >
          {submitted ? (
            <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
              <HiCheckCircle className="text-5xl text-molten" />
              <h3 className="mt-6 font-display text-2xl text-paper">Message sent.</h3>
              <p className="mt-3 max-w-xs text-sm text-paper-dim">
                Thanks, {form.name.split(' ')[0]}. We reply to every project inquiry within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="eyebrow text-[0.6rem]">Name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jordan Lee"
                  className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-molten"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="text-xs text-molten">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="eyebrow text-[0.6rem]">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jordan@company.com"
                  className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-molten"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="text-xs text-molten">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="budget" className="eyebrow text-[0.6rem]">Budget</label>
                <select
                  id="budget"
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-molten"
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="eyebrow text-[0.6rem]">Project details</label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your project, timeline and goals..."
                  className="w-full resize-none rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-molten"
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <p className="text-xs text-molten">{errors.message}</p>}
              </div>

              <button
                ref={submitRef}
                type="submit"
                data-cursor="link"
                className="w-full rounded-full bg-molten py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ember"
              >
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
