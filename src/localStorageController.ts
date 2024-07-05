const SHOW_RATING_ICON_FG = 'showRatingIconFg';

class LocalStorageController {
  showRatingIconFg: boolean;

  constructor() {
    this.showRatingIconFg =
      localStorage.getItem(SHOW_RATING_ICON_FG) === 'true';
  }

  saveCheckboxState(flags: LocalStorageState) {
    this.showRatingIconFg = flags[SHOW_RATING_ICON_FG];
  }
}

export { SHOW_RATING_ICON_FG, LocalStorageController };
