import NotificationForm from "./NotificationForm";
import ScheduleForm from "./ScheduleForm";
import ScheduledList from "./ScheduleList";
import SentList from "./SentList";

export default function GerenciarNotificacoesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Notificações</h1>

      <NotificationForm />
      <ScheduleForm />
      <ScheduledList />
      <SentList />
    </div>
  );
}
