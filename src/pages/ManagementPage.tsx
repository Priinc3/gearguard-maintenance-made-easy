import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTeams, useCategories, useCreateTeam, useCreateCategory, useTeamMembers } from '@/hooks/useData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
    Plus,
    Users,
    Tag,
    Loader2,
    Settings2,
    ArrowLeft,
    UserPlus,
    Trash2,
    Edit
} from 'lucide-react';

// Team Form Modal
function TeamFormModal({
    open,
    onOpenChange,
    onSuccess
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const createTeam = useCreateTeam();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Team name is required');
            return;
        }

        try {
            await createTeam.mutateAsync({ name, description });
            toast.success('Team created successfully');
            setName('');
            setDescription('');
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create team');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Maintenance Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name *</Label>
                        <Input
                            id="teamName"
                            placeholder="e.g. Mechanical Team A"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teamDesc">Description</Label>
                        <Textarea
                            id="teamDesc"
                            placeholder="Brief description of the team..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createTeam.isPending}>
                            {createTeam.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Team
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Category Form Modal
function CategoryFormModal({
    open,
    onOpenChange,
    onSuccess
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('⚙️');
    const [color, setColor] = useState('#3b82f6');
    const [description, setDescription] = useState('');
    const createCategory = useCreateCategory();

    const iconOptions = ['⚙️', '🔧', '🔌', '🚗', '💻', '🏭', '🔩', '📦', '🛠️', '⚡'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            await createCategory.mutateAsync({ name, icon, color, description });
            toast.success('Category created successfully');
            setName('');
            setIcon('⚙️');
            setColor('#3b82f6');
            setDescription('');
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create category');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="catName">Category Name *</Label>
                        <Input
                            id="catName"
                            placeholder="e.g. CNC Machines"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <div className="flex flex-wrap gap-2">
                            {iconOptions.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setIcon(emoji)}
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-all',
                                        icon === emoji
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                            : 'border-border hover:bg-muted'
                                    )}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catColor">Color</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                id="catColor"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-11 w-14 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-11 flex-1"
                                placeholder="#3b82f6"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catDesc">Description</Label>
                        <Textarea
                            id="catDesc"
                            placeholder="Brief description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[60px] resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createCategory.isPending}>
                            {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Team Card with Members
function TeamCard({ team, onRefresh }: { team: any; onRefresh: () => void }) {
    const { data: members = [], isLoading } = useTeamMembers(team.id);

    return (
        <Card className="group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        {team.description && (
                            <CardDescription className="mt-1">{team.description}</CardDescription>
                        )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {team.member_count || 0} members
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : members.length > 0 ? (
                    <div className="space-y-2">
                        {members.slice(0, 3).map((member: any) => (
                            <div key={member.id} className="flex items-center justify-between text-sm">
                                <span>{member.member_name}</span>
                                <Badge
                                    variant={member.role === 'manager' ? 'default' : 'secondary'}
                                    className="text-xs"
                                >
                                    {member.role}
                                </Badge>
                            </div>
                        ))}
                        {members.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{members.length - 3} more</p>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No members yet</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ManagementPage() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const { data: teams = [], isLoading: teamsLoading, refetch: refetchTeams } = useTeams();
    const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useCategories();

    const isAdminOrManager = profile?.role === 'admin' || profile?.role === 'manager';

    if (!isAdminOrManager) {
        return (
            <Layout>
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <Settings2 className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="mt-4 text-xl font-semibold">Access Restricted</h2>
                        <p className="mt-2 text-muted-foreground">
                            Only admins and managers can access this page.
                        </p>
                        <Button onClick={() => navigate('/')} className="mt-4">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Management</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage teams and equipment categories
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="teams" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="teams" className="gap-2">
                            <Users className="h-4 w-4" />
                            Maintenance Teams
                        </TabsTrigger>
                        <TabsTrigger value="categories" className="gap-2">
                            <Tag className="h-4 w-4" />
                            Categories
                        </TabsTrigger>
                    </TabsList>

                    {/* Teams Tab */}
                    <TabsContent value="teams" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Maintenance Teams</h2>
                                <p className="text-sm text-muted-foreground">
                                    Create and manage maintenance teams with their members
                                </p>
                            </div>
                            <Button onClick={() => setTeamModalOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Team
                            </Button>
                        </div>

                        {teamsLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : teams.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 font-medium">No teams yet</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Create your first maintenance team to get started
                                    </p>
                                    <Button onClick={() => setTeamModalOpen(true)} className="mt-4 gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Team
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {teams.map((team) => (
                                    <TeamCard key={team.id} team={team} onRefresh={refetchTeams} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Categories Tab */}
                    <TabsContent value="categories" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Equipment Categories</h2>
                                <p className="text-sm text-muted-foreground">
                                    Organize equipment by category for easier management
                                </p>
                            </div>
                            <Button onClick={() => setCategoryModalOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        </div>

                        {categoriesLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : categories.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Tag className="h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 font-medium">No categories yet</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Create categories to organize your equipment
                                    </p>
                                    <Button onClick={() => setCategoryModalOpen(true)} className="mt-4 gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Category
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {categories.map((cat) => (
                                    <Card key={cat.id} className="group hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                                                    style={{ backgroundColor: `${cat.color}20` }}
                                                >
                                                    {cat.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium truncate">{cat.name}</h3>
                                                    {cat.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {cat.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <TeamFormModal
                open={teamModalOpen}
                onOpenChange={setTeamModalOpen}
                onSuccess={refetchTeams}
            />
            <CategoryFormModal
                open={categoryModalOpen}
                onOpenChange={setCategoryModalOpen}
                onSuccess={refetchCategories}
            />
        </Layout>
    );
}
