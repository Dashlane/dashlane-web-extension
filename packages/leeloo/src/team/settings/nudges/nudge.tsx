import {
  addDays,
  format,
  getDay,
  intlFormat,
  nextDay,
  setDay,
  setHours,
  setMinutes,
} from "date-fns";
import { useFormik } from "formik";
import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Infobox,
  LinkButton,
  SelectField,
  SelectOption,
  Toggle,
} from "@dashlane/design-system";
import {
  NudgeDay,
  NudgeDays,
  NudgeFrequency,
  NudgeType,
  TeamNudge,
  UpdateTeamNudgeCommandParam,
} from "@dashlane/risk-mitigation-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import {
  ClickOrigin,
  Button as HermesButton,
  NudgeType as HermesNudgeType,
  IntegrationPlatform,
  State,
  UserClickEvent,
  UserToggleNudgeEvent,
} from "@dashlane/hermes";
interface Props {
  updateNudge: (params: UpdateTeamNudgeCommandParam) => Promise<void>;
  sendTestNudge: (type: NudgeType) => Promise<void>;
  displayName: NudgeType;
  dropdownOptions?: {
    frequency: NudgeFrequency[];
    dayOfWeek: NudgeDay[];
    timeOfDayUtc: number[];
  };
  existingNudge?: TeamNudge;
}
type NudgeForm = {
  active: boolean;
  frequency: NudgeFrequency;
  dayOfWeek: NudgeDay;
  localTimeOfDay: number;
};
const mapDayToNumber = (day: NudgeDay): number => {
  return NudgeDays.findIndex((value) => value === day);
};
const nextNudgeDateFormat = (values: NudgeForm): Date => {
  const date = new Date();
  let nextNudge = setHours(date, values.localTimeOfDay);
  nextNudge = setMinutes(nextNudge, 0);
  if (values.frequency === "daily") {
    nextNudge = addDays(nextNudge, 1);
  } else {
    const dayOfToday = getDay(nextNudge);
    const selectedDay = mapDayToNumber(values.dayOfWeek);
    const isTodayButTimePassed =
      selectedDay === dayOfToday && date.getHours() >= values.localTimeOfDay;
    if (selectedDay !== dayOfToday || isTodayButTimePassed) {
      nextNudge = nextDay(nextNudge, mapDayToNumber(values.dayOfWeek) as Day);
    }
  }
  return nextNudge;
};
const convertUtcTimeToLocal = (utcHours: number): number => {
  const date = new Date();
  date.setUTCHours(utcHours, 0, 0);
  return date.getHours();
};
const convertUtcDayToLocal = (utcDay: NudgeDay, utcHours: number): NudgeDay => {
  const date = setDay(new Date(), mapDayToNumber(utcDay));
  date.setUTCHours(utcHours, 0, 0);
  const nextDayIndex = date.getDay();
  return NudgeDays[nextDayIndex];
};
const convertLocalDayTimeToUtc = (
  localHours: number,
  localDay: NudgeDay
): {
  utcHours: number;
  utcDay: NudgeDay;
} => {
  let date = new Date();
  date.setHours(localHours, 0, 0);
  date = setDay(date, mapDayToNumber(localDay));
  const nextDayIndex = date.getUTCDay();
  return { utcHours: date.getUTCHours(), utcDay: NudgeDays[nextDayIndex] };
};
const I18N_KEYS = {
  COMPROMISED_PWD_NUDGE_TITLE: "nudges_compromised_password_nudge_title",
  REUSED_PWD_NUDGE_TITLE: "nudges_reused_password_nudge_title",
  WEAK_PWD_NUDGE_TITLE: "nudges_weak_password_nudge_title",
  COMPROMISED_PWD_NUDGE_DESC: "nudges_compromised_password_nudge_description",
  REUSED_PWD_NUDGE_DESC: "nudges_reused_password_nudge_description",
  WEAK_PWD_NUDGE_DESC: "nudges_weak_password_nudge_description",
  NUDGE_OPTIONS_TITLE: "nudges_configuration_options_title",
  NUDGE_OPTIONS_FREQUENCY: "nudges_configuration_options_frequency",
  NUDGE_OPTIONS_FREQUENCY_DAILY: "nudges_configuration_options_frequency_daily",
  NUDGE_OPTIONS_FREQUENCY_WEEKLY:
    "nudges_configuration_options_frequency_weekly",
  NUDGE_OPTIONS_DAY: "nudges_configuration_options_day",
  NUDGE_OPTIONS_DAY_MONDAY: "nudges_configuration_options_day_monday",
  NUDGE_OPTIONS_DAY_TUESDAY: "nudges_configuration_options_day_tuesday",
  NUDGE_OPTIONS_DAY_WEDNESDAY: "nudges_configuration_options_day_wednesday",
  NUDGE_OPTIONS_DAY_THURSDAY: "nudges_configuration_options_day_thursday",
  NUDGE_OPTIONS_DAY_FRIDAY: "nudges_configuration_options_day_friday",
  NUDGE_OPTIONS_DAY_SATURDAY: "nudges_configuration_options_day_saturday",
  NUDGE_OPTIONS_DAY_SUNDAY: "nudges_configuration_options_day_sunday",
  NUDGE_OPTIONS_HOUR: "nudges_configuration_options_hour",
  NUDGE_NEXT_OCCURRENCE: "nudges_configuration_next_occurrence",
  NUDGE_NEXT_OCCURRENCE_NO_USER: "nudges_configuration_next_occurrence_no_user",
  NUDGE_NEXT_OCCURRENCE_SINGLE_USER:
    "nudges_configuration_next_occurrence_single_user",
  LEARN_MORE: "_common_action_learn_more",
  SEND_TEST: "team_settings_nudges_send_test",
};
const NUDGE_TITLE: Record<NudgeType, string> = {
  compromised_passwords: I18N_KEYS.COMPROMISED_PWD_NUDGE_TITLE,
  reused_passwords: I18N_KEYS.REUSED_PWD_NUDGE_TITLE,
  weak_passwords: I18N_KEYS.WEAK_PWD_NUDGE_TITLE,
};
const NUDGE_DESC: Record<NudgeType, string> = {
  compromised_passwords: I18N_KEYS.COMPROMISED_PWD_NUDGE_DESC,
  reused_passwords: I18N_KEYS.REUSED_PWD_NUDGE_DESC,
  weak_passwords: I18N_KEYS.WEAK_PWD_NUDGE_DESC,
};
const NUDGE_DEFAULT_DAY: Record<NudgeType, NudgeDay> = {
  compromised_passwords: "monday",
  reused_passwords: "wednesday",
  weak_passwords: "friday",
};
const NUDGE_LINK: Record<NudgeType, string> = {
  compromised_passwords: "__REDACTED__",
  reused_passwords: "__REDACTED__",
  weak_passwords: "__REDACTED__",
};
const HERMES_NUDGE_TYPE: Record<NudgeType, HermesNudgeType> = {
  compromised_passwords: HermesNudgeType.CompromisedPasswords,
  reused_passwords: HermesNudgeType.ReusedPasswords,
  weak_passwords: HermesNudgeType.WeakPasswords,
};
const HERMES_LEARN_MORE_CLICK_ORIGIN: Record<NudgeType, ClickOrigin> = {
  compromised_passwords: ClickOrigin.NudgesCompromisedPasswords,
  reused_passwords: ClickOrigin.NudgesReusedPasswords,
  weak_passwords: ClickOrigin.NudgesWeakPasswords,
};
export const Nudge = ({
  updateNudge,
  sendTestNudge,
  displayName,
  dropdownOptions,
  existingNudge,
}: Props) => {
  const { translate } = useTranslate();
  const [nextNudgeDate, setNextNudgeDate] = useState<Date | undefined>(
    existingNudge?.nextRunTimestamp
      ? new Date(existingNudge.nextRunTimestamp * 1000)
      : undefined
  );
  const formik = useFormik<NudgeForm>({
    initialValues: {
      active: existingNudge ? existingNudge.active : false,
      frequency: existingNudge?.options?.frequency ?? "weekly",
      dayOfWeek: existingNudge?.options?.dayOfWeek
        ? convertUtcDayToLocal(
            existingNudge.options.dayOfWeek,
            existingNudge.options.timeOfDayUtc
          )
        : NUDGE_DEFAULT_DAY[displayName],
      localTimeOfDay: existingNudge?.options?.timeOfDayUtc
        ? convertUtcTimeToLocal(existingNudge.options.timeOfDayUtc)
        : 14,
    },
    onSubmit: async (values) => {
      const { active, frequency, dayOfWeek, localTimeOfDay } = values;
      const { utcHours: timeOfDayUtc, utcDay: dayOfWeekUtc } =
        convertLocalDayTimeToUtc(localTimeOfDay, dayOfWeek);
      await updateNudge({
        name: displayName,
        active,
        options: {
          frequency,
          dayOfWeek: frequency === "weekly" ? dayOfWeekUtc : undefined,
          timeOfDayUtc,
        },
      });
    },
  });
  const onLearnMore = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.LearnMoreAboutNudges,
        clickOrigin: HERMES_LEARN_MORE_CLICK_ORIGIN[displayName],
      })
    );
  };
  const handleChange = async <T extends keyof NudgeForm>(
    value: NudgeForm[T],
    key: T
  ) => {
    if (key === "active") {
      logEvent(
        new UserToggleNudgeEvent({
          nudgeState: value ? State.On : State.Off,
          integrationPlatform: IntegrationPlatform.Slack,
          nudgeType: HERMES_NUDGE_TYPE[displayName],
        })
      );
    }
    await formik.setFieldValue(key, value);
    await formik.submitForm();
    if (
      key === "frequency" ||
      key === "dayOfWeek" ||
      key === "localTimeOfDay"
    ) {
      const date = nextNudgeDateFormat({ ...formik.values, [key]: value });
      setNextNudgeDate(date);
    }
  };
  const nextNudgeTitle = (nextDate: Date) => {
    const userCount = existingNudge?.expectedUserCount ?? 0;
    if (userCount === 0) {
      return translate(I18N_KEYS.NUDGE_NEXT_OCCURRENCE_NO_USER, {
        nudgeType: translate(NUDGE_TITLE[displayName]).toLocaleLowerCase(),
      });
    }
    return translate(
      userCount === 1
        ? I18N_KEYS.NUDGE_NEXT_OCCURRENCE_SINGLE_USER
        : I18N_KEYS.NUDGE_NEXT_OCCURRENCE,
      {
        numberOfUsers: userCount,
        time: format(nextDate, "kk:mm"),
        date: intlFormat(nextDate, {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    );
  };
  return (
    <>
      <Toggle
        id={displayName}
        label={translate(NUDGE_TITLE[displayName])}
        description={translate(NUDGE_DESC[displayName])}
        onChange={(event) => handleChange(event.target.checked, "active")}
        checked={formik.values.active}
      />
      {formik.values.active && dropdownOptions ? (
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "ds.container.agnostic.neutral.standard",
            borderColor: "ds.border.neutral.standard.idle",
            padding: "16px",
            borderRadius: "8px",
            marginY: "16px",
            gap: "16px",
          }}
        >
          <Heading
            as="h1"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.NUDGE_OPTIONS_TITLE)}
          </Heading>
          <div
            sx={{
              display: "grid",
              gridTemplateColumns: [
                "auto",
                "auto",
                "auto auto",
                "auto auto auto",
              ],
              gap: "16px",
            }}
          >
            <SelectField
              label={translate(I18N_KEYS.NUDGE_OPTIONS_FREQUENCY)}
              onChange={(value) =>
                handleChange(value as NudgeFrequency, "frequency")
              }
              value={formik.values.frequency}
              labelPersists
            >
              {dropdownOptions.frequency.map((value, index) => (
                <SelectOption key={`${value}-${index}`} value={value}>
                  {translate(`${I18N_KEYS.NUDGE_OPTIONS_FREQUENCY}_${value}`)}
                </SelectOption>
              ))}
            </SelectField>
            <SelectField
              label={translate(I18N_KEYS.NUDGE_OPTIONS_DAY)}
              onChange={(value) => handleChange(value as NudgeDay, "dayOfWeek")}
              value={formik.values.dayOfWeek}
              disabled={formik.values.frequency === "daily"}
              labelPersists
            >
              {dropdownOptions.dayOfWeek.map((value, index) => (
                <SelectOption key={`${value}-${index}`} value={value}>
                  {translate(`${I18N_KEYS.NUDGE_OPTIONS_DAY}_${value}`)}
                </SelectOption>
              ))}
            </SelectField>
            <SelectField
              label={translate(I18N_KEYS.NUDGE_OPTIONS_HOUR)}
              onChange={(value) =>
                handleChange(Number(value), "localTimeOfDay")
              }
              value={String(formik.values.localTimeOfDay)}
              labelPersists
            >
              {dropdownOptions.timeOfDayUtc.map((value, index) => (
                <SelectOption
                  key={`${value}-${index}`}
                  value={String(value)}
                >{`${value}:00`}</SelectOption>
              ))}
            </SelectField>
          </div>
          {nextNudgeDate ? (
            <Infobox title={nextNudgeTitle(nextNudgeDate)} />
          ) : null}
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <LinkButton
              href={NUDGE_LINK[displayName]}
              onClick={onLearnMore}
              isExternal
            >
              {translate(I18N_KEYS.LEARN_MORE)}
            </LinkButton>
            <Button
              mood="brand"
              intensity="quiet"
              layout="iconLeading"
              icon="FeatureAutomationsOutlined"
              onClick={() => sendTestNudge(displayName)}
            >
              {translate(I18N_KEYS.SEND_TEST)}
            </Button>
          </Flex>
        </div>
      ) : null}
    </>
  );
};
