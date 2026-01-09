# Missing Features & Logic Analysis

## Summary
After reviewing both the frontend and backend codebases, here are the features and logic that appear to be missing or incomplete:

---

## 🔴 **Missing Feature: Email Sending from Admin Booking Detail Page**

### Backend Implementation: ✅ EXISTS
- **Endpoint**: `POST /api/bookings/:bookingId/send-email`
- **Location**: `Asterias-Backend/src/routes/bookings.js:463`
- **Functionality**: Allows admins to send emails to guests:
  - Confirmation emails (`emailType: 'confirmation'`)
  - Arrival reminder emails (`emailType: 'reminder'`)
  - Custom emails (`emailType: 'custom'` with `customMessage`)

### Frontend Implementation: ❌ MISSING
- **Location**: `Asterias-Homes/app/admin/bookings/[bookingId]/page.tsx`
- **Issue**: No UI button or functionality to send emails to guests
- **Required**: 
  1. Add API client method in `lib/api-client.ts`
  2. Add React Query hook in `hooks/api/use-admin.ts` or `hooks/api/use-bookings.ts`
  3. Add UI buttons/dropdown in the booking detail page sidebar (Actions section)
  4. Add dialog for custom message input (for custom emails)

---

## 🟡 **Potential Missing Features (To Verify)**

### 1. Bulk Operations UI
- **Backend**: Has endpoints for bulk delete and bulk status update (`DELETE /api/admin/bookings/bulk`, `PUT /api/admin/bookings/bulk/status`)
- **Frontend**: Check if bulk operations UI exists in `app/admin/bookings/page.tsx`
- **Status**: Need to verify if checkbox selection and bulk action buttons exist

### 2. Booking Statistics/Overview
- **Backend**: `GET /api/bookings/stats/overview` (admin only)
- **Frontend**: Need to verify if this is used anywhere (possibly in admin dashboard)

### 3. Room Statistics
- **Backend**: `GET /api/rooms/stats/overview`
- **Frontend**: Need to verify if room statistics are displayed anywhere

### 4. Contact Statistics
- **Backend**: `GET /api/contact/stats/overview`
- **Frontend**: Need to verify if contact statistics are displayed in admin contacts page

---

## ✅ **Completed Features (Verified)**

All features listed in `MISSING_FEATURES.md` are marked as completed:
- ✅ My Bookings Page
- ✅ User Booking Cancellation
- ✅ Admin Booking Detail Page (with real data)
- ✅ Refund Functionality
- ✅ Admin Booking Cancellation with Refund

---

## 📋 **Recommendations**

### Priority 1: Email Sending Functionality
Add email sending buttons to the admin booking detail page:
- "Send Confirmation Email" button
- "Send Arrival Reminder" button  
- "Send Custom Email" button (with message dialog)

### Priority 2: Verify Bulk Operations
Check if the bookings list page has:
- Checkbox selection for multiple bookings
- Bulk delete button
- Bulk status update functionality

### Priority 3: Statistics Integration
Verify that all statistics endpoints are properly integrated:
- Booking stats in admin dashboard
- Room stats (if needed)
- Contact stats in contacts page

---

## 🔍 **Files to Check/Update**

### For Email Sending Feature:
1. `Asterias-Homes/lib/api-client.ts` - Add `sendBookingEmail()` method
2. `Asterias-Homes/hooks/api/use-admin.ts` - Add `useSendBookingEmail()` hook
3. `Asterias-Homes/app/admin/bookings/[bookingId]/page.tsx` - Add email sending UI
4. `Asterias-Homes/contexts/jsons/*.json` - Add translations for email sending buttons/messages

### For Bulk Operations (if missing):
1. `Asterias-Homes/app/admin/bookings/page.tsx` - Add checkbox selection and bulk action UI
2. `Asterias-Homes/lib/api-client.ts` - Verify bulk operation methods exist
3. `Asterias-Homes/hooks/api/use-admin.ts` - Add bulk operation hooks

---

## 🎯 **Next Steps**

1. **Immediate**: Implement email sending functionality in admin booking detail page
2. **Short-term**: Verify and implement any missing bulk operations
3. **Ongoing**: Review and integrate any unused statistics endpoints

