export default function AdminHomePage() {
  // Este conteúdo será injetado dentro da tag {children} do seu AdminTioBenLayout

  return (
    <div className="admin-home-content">
      <h1 className="text-3xl font-bold mb-6">Dashboard Administrativo</h1>
      <p className="text-gray-600">
        Bem-vindo à área de administração do Tio Ben.
      </p>
      
      {/* Exemplo de uso de dados */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Total de Categorias</h2>
          {/* Aqui você chamaria um Server Action ou hook de dados */}
          <p className="text-4xl text-primary mt-2">12</p>
        </div>
        {/* ... Outros cards de dashboard */}
      </section>
    </div>
  );
}