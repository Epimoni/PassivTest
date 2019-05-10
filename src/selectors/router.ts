import { createSelector } from 'reselect';
import { AppState } from '../store';

export const selectRouter = (state: AppState) => state.router;

export const selectPathname = createSelector(
  selectRouter,
  router => {
    return router.location.pathname;
  },
);

export const selectIsEditMode = createSelector(
  selectRouter,
  router => {
    return router.location.search === '?edit=true';
  },
);