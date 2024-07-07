const SHOW_RATING_ICON_FG = 'showRatingIconFg';
const SHOW_RATING_ICON_STANDINGS_FG = 'showRatingIconProfileFg';
const CHECKBOX_STATE_KEY = 'ac-hide-rating-icon-config';

class LocalStorageController {
  changeState: boolean;
  showRatingIconFg: boolean;
  showRatingIconProfileFg: boolean;

  constructor() {
    this.changeState = true;
    if (!localStorage.hasOwnProperty(CHECKBOX_STATE_KEY)) {
      this.saveRadioState({
        showRatingIconFg: false,
        showRatingIconProfileFg: false,
      });
    }
  }

  saveRadioState(flags: LocalStorageState) {
    this.changeState = true;
    localStorage.setItem(CHECKBOX_STATE_KEY, JSON.stringify(flags));
  }

  getRadioState(): LocalStorageState {
    if (this.changeState) {
      const jsonString = localStorage.getItem(CHECKBOX_STATE_KEY);
      const object = JSON.parse(jsonString);

      const needSave =
        !object.hasOwnProperty(SHOW_RATING_ICON_FG) ||
        !object.hasOwnProperty(SHOW_RATING_ICON_STANDINGS_FG);

      this.showRatingIconFg = object.hasOwnProperty(SHOW_RATING_ICON_FG)
        ? object[SHOW_RATING_ICON_FG]
        : true;

      this.showRatingIconProfileFg = object.hasOwnProperty(
        SHOW_RATING_ICON_STANDINGS_FG,
      )
        ? object[SHOW_RATING_ICON_STANDINGS_FG]
        : true;

      if (needSave) {
        this.saveRadioState({
          showRatingIconFg: this.showRatingIconFg,
          showRatingIconProfileFg: this.showRatingIconProfileFg,
        });

        this.changeState = false;
      }
    }

    return {
      showRatingIconFg: this.showRatingIconFg,
      showRatingIconProfileFg: this.showRatingIconProfileFg,
    };
  }
}

export { SHOW_RATING_ICON_FG, LocalStorageController };
