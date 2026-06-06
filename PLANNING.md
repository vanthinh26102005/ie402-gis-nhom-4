# Google Maps-Style Reviews Planning

## Goal

Build a destination review system inspired by Google Maps: reviews live inside the place detail context, are easy for non-technical travelers to use, and are governed by a clear moderation workflow.

## Product Principles

- Reviews must be tied to a real destination context, not primarily a standalone form.
- The user sees useful travel signals first: average rating, number of reviews, common tags, recent comments, and photos when available.
- The writing flow must be short: choose stars, write experience, optionally add tags/photos, submit.
- Public content must only show approved reviews.
- Admins need a review queue, moderation notes, and owner-style replies.
- Technical details such as database fields, moderation algorithms, or scoring formulas must not be exposed to end users.

## Research Notes From Google Maps

- Google Maps lets users add ratings/reviews from a place detail view.
- Reviews are public and tied to the contributor profile, not anonymous.
- Google moderates user-generated content and removes policy-violating reviews.
- Businesses/owners can reply to reviews after verification; replies are public under the customer review.
- Reviews can be flagged/reported when they violate content policy.
- Google discourages fake engagement, paid reviews, spam, irrelevant content, offensive content, and personal information exposure.

Sources:

- https://support.google.com/maps/answer/6230175/write-reviews-and-add-ratings-of-places-computer
- https://support.google.com/business/answer/3474050
- https://support.google.com/contributionpolicy/answer/7400114
- https://blog.google/products-and-platforms/products/maps/how-google-maps-reviews-work/

## Current App Baseline

- `reviews` table exists with `score`, `content`, and `status`.
- Public API exists for listing and creating reviews.
- Admin moderation exists for approving/hiding reviews.
- User review form exists at `/reviews`.
- Destination detail has basic destination information but not a Google Maps-style review summary/list.
- Map detail panel does not yet expose review summary and review entry point.

## Target Phases

### Phase 1 - Backend Review Foundation

- [x] Add review summary endpoint by destination.
- [x] Support public review filters: destination, rating, sort, keyword.
- [x] Keep public list restricted to `published`.
- [ ] Add owner/admin reply storage.
- [ ] Add report storage for inappropriate reviews.
- [ ] Add moderation notes and hidden reasons.

### Phase 2 - Frontend API And Types

- [x] Add review summary type.
- [ ] Add review reply/report types.
- [x] Add API functions for summary and filtered list.
- [x] Preserve existing submit flow while moving the main entry point into destination context.

### Phase 3 - Destination Detail UX

- [x] Add rating summary block.
- [x] Add rating distribution bars.
- [x] Add review list with sort/filter/search.
- [x] Add `Viết đánh giá` form bound to the current destination.
- [x] Show pending-submission state clearly with a private submitted-review card, review status, and next actions.
- [ ] Show admin replies under reviews.

### Phase 4 - Map Detail Panel UX

- [ ] Add compact rating summary in the map `Chi tiết` panel.
- [ ] Show top 2 recent reviews.
- [ ] Add `Viết đánh giá` and `Xem tất cả` actions.
- [ ] Avoid Leaflet popups for destination/service detail.

### Phase 5 - Admin Moderation

- [ ] Improve admin review list filters.
- [ ] Show report count and media status.
- [ ] Add reply editor.
- [ ] Add moderation note and hidden reason.
- [ ] Add reported review queue.

### Phase 6 - Media And Trust

- [ ] Add review media table.
- [ ] Add image upload UI.
- [ ] Show review image thumbnails.
- [ ] Add lightweight trust badges such as `Đã lên lịch trình`.

## P0 Execution Scope

The first execution slice should ship a useful review experience without requiring file uploads:

- Backend summary endpoint.
- Backend list filters/sort/search.
- Frontend review summary/list components on destination detail.
- Context-bound review form for the current destination.
- Map panel compact review summary.

## User-Facing UX Copy

- `Viết đánh giá`
- `Đánh giá đang chờ duyệt`
- `Tất cả`
- `Có ảnh`
- `Mới nhất`
- `Điểm cao`
- `Điểm thấp`
- `Tìm trong đánh giá`
- `Phản hồi từ ban quản lý`
- `Báo cáo đánh giá`

## Quality Checklist

- [ ] Non-technical copy only in user UI.
- [ ] No database/moderation implementation details shown to users.
- [x] Review submit flow keeps users oriented with loading, pending status, and login redirect back to destination.
- [ ] Mobile review sheet has stable width and scroll.
- [ ] Public pages only render approved reviews.
- [ ] Admin can inspect pending reviews.
- [ ] Lint passes.
- [ ] Review tests cover summary and filtering.
