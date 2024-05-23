import * as React from 'react';
import { TeamMemberInfo } from '@dashlane/communication';
import { getTeamMembers } from 'libs/carbon/triggers';
import { Lee, LEE_INCORRECT_AUTHENTICATION, LeeWithStorage } from 'lee';
import { getAuth } from 'user';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
type ComponentType<Props> = React.ComponentClass<Props> | React.StatelessComponent<Props>;
export interface RequiredProps {
    lee: Lee | LeeWithStorage<any>;
}
export default function withTeamMembers<P extends RequiredProps>(InnerComponent: ComponentType<P>): React.ComponentType<P> {
    const WithTeamMembers = (props: P) => {
        const [members, setMembers] = React.useState<TeamMemberInfo[]>([]);
        const { reportTACError } = useAlertQueue();
        React.useEffect(() => {
            const fetchTeamMembers = async () => {
                const auth = getAuth(props.lee.globalState);
                if (!auth) {
                    reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
                }
                else {
                    try {
                        const teamMembers = auth.teamId
                            ? await getTeamMembers({ teamId: auth.teamId })
                            : [];
                        setMembers(teamMembers);
                    }
                    catch (error) {
                        reportTACError(error);
                    }
                }
            };
            fetchTeamMembers();
        }, []);
        return <InnerComponent {...props} members={members}/>;
    };
    return WithTeamMembers;
}
