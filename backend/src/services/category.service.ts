import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';

export interface CreateCategoryDto {
  title: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
  parentId?: string;
}

function generateSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export class CategoryService {
  private repo = AppDataSource.getRepository(Category);

  async create(data: CreateCategoryDto) {
    if (data.parentId) {
      const parent = await this.repo.findOne({ where: { id: data.parentId } });
      if (!parent) throw new Error('Parent category not found');
    }
    const slug = await this.uniqueSlug(generateSlug(data.title));
    const category = this.repo.create({ ...data, slug });
    return await this.repo.save(category);
  }

  async findAll() {
    return await this.repo.find({
      where: { parentId: null as any },
      relations: ['children', 'children.children'],
      order: { order: 'ASC', title: 'ASC' },
    });
  }

  async findById(id: string) {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['parent', 'children', 'children.children'],
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.repo.findOne({
      where: { slug },
      relations: ['parent', 'children', 'children.children'],
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  async update(id: string, data: Partial<CreateCategoryDto>) {
    const category = await this.findById(id);
    if (data.parentId !== undefined) {
      if (data.parentId === id) throw new Error('Category cannot be its own parent');
      if (data.parentId) {
        const parent = await this.repo.findOne({ where: { id: data.parentId } });
        if (!parent) throw new Error('Parent category not found');
      }
    }
    if (data.title && data.title !== category.title) {
      (data as any).slug = await this.uniqueSlug(generateSlug(data.title), id);
    }
    Object.assign(category, data);
    return await this.repo.save(category);
  }

  async delete(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new Error('Category not found');
  }

  private async uniqueSlug(base: string, excludeId?: string): Promise<string> {
    let slug = base;
    let count = 0;
    while (true) {
      const existing = await this.repo.findOne({ where: { slug } });
      if (!existing || existing.id === excludeId) return slug;
      slug = `${base}-${++count}`;
    }
  }
}
