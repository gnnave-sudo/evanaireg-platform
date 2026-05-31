import click, os, sys
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

console = Console()

@click.group()
@click.version_option("1.0.0", prog_name="evan")
def cli():
    """EvanAIRegPlatform — CLI"""
    pass

@cli.command()
def status():
    """Show system status"""
    console.print(Panel("[bold green]EvanAIRegPlatform v1.0.0[/]\n[cyan]Owner: Evan (Proprietary)[/]\n[yellow]Platform: x870[/]", title="Status", border_style="yellow"))
    table = Table(title="Agents")
    table.add_column("Agent", style="cyan")
    table.add_column("Status", style="green")
    table.add_column("Procedures")
    for a in [("RIE","active",3),("TMA","active",3),("RE","active",4),("ICCA","active","4 + 4 modules")]:
        table.add_row(a[0], a[1], str(a[2]))
    console.print(table)

@cli.command()
@click.argument("query")
@click.option("--entity", default="vortex-pay")
def nl(query, entity):
    """Natural language query"""
    console.print(f"[cyan]Query:[/] {query}")
    console.print(f"[green]Entity:[/] {entity}")
    console.print("[yellow]Response:[/] Use the Contract Workbench for document operations.")

@cli.command()
def entities():
    """List entities"""
    table = Table(title="Entities")
    table.add_column("Slug", style="cyan")
    table.add_column("Name")
    table.add_column("Industry")
    table.add_row("vortex-pay", "Vortex Pay", "fintech")
    console.print(table)

@cli.command()
@click.argument("host", default="0.0.0.0")
@click.argument("port", default=8100)
def serve(host, port):
    """Start API server"""
    console.print(f"[green]Starting EvanAIRegPlatform API on {host}:{port}[/]")
    os.system(f"cd {os.path.dirname(os.path.dirname(os.path.abspath(__file__)))} && uvicorn api.main:app --host {host} --port {port}")

@cli.command()
def docs():
    """Open API documentation URL"""
    console.print("[cyan]API Docs:[/] http://localhost:8100/docs")
    console.print("[cyan]Health:[/]  http://localhost:8100/health")

@cli.command()
def dashboard():
    """Open dashboard"""
    console.print("[cyan]Dashboard:[/] http://localhost:5173")

if __name__ == "__main__":
    cli()
