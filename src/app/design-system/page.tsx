import { Button } from "@/components/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/card"

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-background p-10 space-y-10">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
                <p className="text-muted-foreground">Core components and design tokens for the Spiritual Support Platform.</p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Typography</h2>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold">Heading 1</h1>
                    <h2 className="text-3xl font-semibold">Heading 2</h2>
                    <h3 className="text-2xl font-medium">Heading 3</h3>
                    <p className="text-base">Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className="text-sm text-muted-foreground">Small text (Muted).</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-md bg-primary text-primary-foreground">Primary</div>
                    <div className="p-4 rounded-md bg-secondary text-secondary-foreground">Secondary</div>
                    <div className="p-4 rounded-md bg-accent text-accent-foreground">Accent</div>
                    <div className="p-4 rounded-md bg-muted text-muted-foreground">Muted</div>
                    <div className="p-4 rounded-md bg-card text-card-foreground border">Card</div>
                    <div className="p-4 rounded-md bg-popover text-popover-foreground border">Popover</div>
                    <div className="p-4 rounded-md bg-destructive text-destructive-foreground">Destructive</div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="lg">Large</Button>
                    <Button variant="primary" isLoading>Loading</Button>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Standard Card</CardTitle>
                            <CardDescription>Default card style.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Content goes here.</p>
                        </CardContent>
                        <CardFooter>
                            <Button size="sm">Action</Button>
                        </CardFooter>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Glass Card</CardTitle>
                            <CardDescription>Using glass utility.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Content with improved readability on dark backgrounds.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" size="sm">Glass Action</Button>
                        </CardFooter>
                    </Card>

                    <Card className="glass-hover cursor-pointer">
                        <CardHeader>
                            <CardTitle>Hover Effect</CardTitle>
                            <CardDescription>Hover over me to see the lift effect.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Interactive card example.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
