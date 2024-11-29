import { GuideItem, Task, TaskStatus } from "../types/item.types";
export const GetStartedSection = ({
  completionStatus,
  tasks,
}: {
  completionStatus: Record<Task, TaskStatus>;
  tasks: [string, GuideItem][];
}) => {
  return (
    <ul
      sx={{
        display: "flex",
        padding: "24px",
        flexDirection: "column",
        borderRadius: "8px",
        border: "1px solid ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
      }}
    >
      {tasks.map(([taskName, { component: Item }]) => (
        <Item key={taskName} status={completionStatus[taskName] ?? null} />
      ))}
    </ul>
  );
};
