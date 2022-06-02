Acho que o melhor agora é melhorar a UI e o codigo pra ficar extensivel.
O POC functiona, as outras features é só desenvolver normal, mas o codigo precisa ter uma boa fundação.

Terminar o Quick add column só com uma agg msm.

- Criar datasource num modal e ir pra pagina de edit
- Botoes no header igual sisense: "Add table", "Build"

  - Add table abre modal
  - Quando adicionar vai pra painel na esquerda

- Copiar criação de dataset do Sisense ou fazer melhor (como eu gostaria que fosse)
- Depois mover a criação de Widget pro DashboardEdit com o Grid
  - Grid Layout https://github.com/react-grid-layout/react-grid-layout
    - Add/Edit/Preview Widgets on the same screen
- Operações entre fields podem ser muito complexas, precisa ser feito com codigo mesmo
  - Faz um campo de texto livre "Advanced Formula"

MVP Roadmap:

- Operations between fields
- Filters
- Value as links to external pages
- Scheduled build
- Support multiple tables within a Dataset
- Widget reuse build info
- Load one widget at a time
- Package manager?

Tech debt:

- Use Celery worker to build datasets
- https://react-hook-form.com/advanced-usage#SmartFormComponent
- Graphene --watch error causes foreman to exit
