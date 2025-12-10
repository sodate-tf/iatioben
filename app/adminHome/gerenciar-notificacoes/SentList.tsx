import { getSentNotifications } from "./action";

export default async function SentList() {
  const items = await getSentNotifications();

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow border space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">
        Notificações Enviadas
      </h2>

      {items.length === 0 && (
        <p className="text-sm text-gray-500">
          Nenhuma notificação enviada até o momento.
        </p>
      )}

      {/* ✅ MOBILE: LISTA EM CARDS */}
      <div className="flex flex-col gap-3 sm:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex flex-col gap-2"
          >
            <div className="font-semibold text-base">
              {item.title}
            </div>

            <div className="text-sm text-gray-600">
              🕒 {item.sent_at ? new Date(item.sent_at).toLocaleString() : "—"}
            </div>

            <div className="text-xs text-gray-400">
              Tipo: {item.type}
            </div>

            {/* 🔜 Preparado para métricas no futuro */}
            {typeof item.opened_count !== "undefined" && typeof item.delivered_count !== "undefined" && (
              <div className="text-xs text-gray-500 pt-1">
                📊 Cliques: {item.opened_count} | Tentativas: {item.delivered_count}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ DESKTOP: TABELA */}
      <div className="hidden sm:block">
        <table className="w-full text-sm mt-3">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Título</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Enviada em</th>
              <th className="p-2">Métricas</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const ctr =
                item.opened_count && item.delivered_count
                  ? ((item.opened_count / item.delivered_count) * 100).toFixed(1) + "%"
                  : "—";

              return (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-2 font-medium">{item.title}</td>
                  <td className="p-2 capitalize">{item.type}</td>
                  <td className="p-2">
                    {item.sent_at
                      ? new Date(item.sent_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2 text-xs">
                    {typeof item.opened_count !== "undefined" &&
                    typeof item.delivered_count !== "undefined" ? (
                      <>
                        Cliques: {item.opened_count} /{" "}
                        {item.delivered_count} ({ctr})
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
