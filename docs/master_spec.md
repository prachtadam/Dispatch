# Dispatch Platform – Master Spec

## Goal
Build a tech-first dispatch and work order system for field service (starting with irrigation) that acts like an intelligent dispatcher, tracking jobs, tech performance, inventory, and routing automatically.

---

## Core Requirements

### 1. Tech-First App
- Mobile-first
- Button-based UI
- Minimal typing
- Voice input for job creation

---

### 2. Roles
- Admin (full control)
- Office (review, reporting, adjustments)
- Tech (field execution)
- Helper (attached to tech/jobs)

---

### 3. Jobs
Each job includes:
- customer
- field (linked to customer)
- lat/lon
- job type (color-coded)
- description
- status

Statuses:
- open
- assigned
- acknowledged
- on_the_way
- arrived
- diagnosing
- repairing
- paused
- completed

---

### 4. Dispatch Engine
System automatically assigns jobs based on:
- tech skill
- location
- workload
- inventory on truck
- weather
- time of day

Must support:
- auto reassignment
- tech self-dispatch
- paused job priority
- continuous optimization

---

### 5. Inventory System
3 levels:
- main inventory (shop)
- minimum truck stock
- live truck stock

Features:
- restock prompts
- temporary stock tracking
- quarterly audits

---

### 6. Diagnostics
- step-by-step flows
- pass/fail branching
- problem-specific workflows
- suggested parts/tools
- optional Bluetooth meter input

---

### 7. Weather
- forecast awareness
- tech-reported conditions
- escalating confidence system
- affects dispatch decisions

---

### 8. Safety
- GPS tracking
- inactivity detection
- tech check prompt
- escalation to staff

---

### 9. Calendar
- built-in calendar
- time off
- appointment blocking
- dispatch must respect availability

---

### 10. Maps
- show tech locations
- show job pins
- route to jobs
- use field lat/lon

---

### 11. Customer Notifications
Toggle per customer:
- scheduled
- on the way
- arrived
- completed
- work summary

---

### 12. Work Orders
- auto numbering by job type
- office review
- invoice-ready status
- labor auto-calculated

---

### 13. Offline First
Must work without service:
- job updates
- diagnostics
- inventory
- photos
- sync later

---

### 14. CSV Imports
Support:
- customers
- fields
- products
- truck stock

Fields must link to customer_id.

---

## Tech Stack

- Frontend: React (recommended)
- Backend: Supabase
- Database: Postgres
- Storage: Supabase storage
- Auth: username + PIN
- Offline: local cache + sync queue

---

## Initial Deliverables

1. Basic frontend app
2. Supabase connection
3. Job CRUD
4. Customer/field linking
5. Dispatch engine skeleton
6. Inventory tracking
7. Map view with pins

---

## Notes
- Do not hardcode business data
- Everything configurable in UI
- System must learn over time
