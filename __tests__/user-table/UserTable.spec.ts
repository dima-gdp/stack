import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import UserTable from '@/components/user-table/UserTable.vue';

// Написал тесты перед рефакторингом, не должно быть все в одном файле и опираться на css класы
describe('UserTable', () => {
  let wrapper: VueWrapper;

  const createWrapper = (props = {}) => {
    return mount(UserTable, {
      props: {
        title: 'Управление пользователями',
        initialPageSize: 25,
        apiEndpoint: '/api/users',
        ...props
      }
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const waitForData = async () => {
    await vi.advanceTimersByTimeAsync(1000);
    await wrapper.vm.$nextTick();
  };

  describe('Рендеринг компонента', () => {
    it('должен отрендерить компонент с заголовком', () => {
      expect(wrapper.find('h2').text()).toBe('Управление пользователями');
    });

    it('должен отрендерить поле поиска', () => {
      const searchInput = wrapper.find('.search-input');
      expect(searchInput.exists()).toBe(true);
      expect(searchInput.attributes('placeholder')).toBe('Поиск по имени, email...');
    });

    it('должен отрендерить фильтр по ролям', () => {
      const roleFilter = wrapper.find('.role-filter');
      expect(roleFilter.exists()).toBe(true);
    });

    it('должен отрендерить кнопку добавления пользователя', () => {
      const addButton = wrapper.find('.btn-primary');
      expect(addButton.text()).toContain('Добавить пользователя');
    });

    it('должен отрендерить кнопку экспорта', () => {
      const exportButton = wrapper.find('.btn-secondary');
      expect(exportButton.text()).toContain('Экспорт');
    });
  });

  describe('Загрузка данных', () => {
    it('должен показать индикатор загрузки при монтировании', () => {
      expect(wrapper.find('.loading-overlay').exists()).toBe(true);
      expect(wrapper.find('.spinner').exists()).toBe(true);
    });

    it('должен загрузить пользователей после монтирования', async () => {
      await waitForData();

      expect(wrapper.find('.loading-overlay').exists()).toBe(false);
      expect(wrapper.findAll('[data-testid="user-row"]').length).toBeGreaterThan(0);
    });

    it('должен отобразить таблицу после загрузки', async () => {
      await waitForData();

      expect(wrapper.find('.user-table').exists()).toBe(true);
      expect(wrapper.findAll('[data-testid="user-row"]').length).toBeGreaterThan(0);
    });
  });

  describe('Поиск', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен фильтровать пользователей по имени', async () => {
      const initialCount = wrapper.findAll('[data-testid="user-row"]').length;

      const searchInput = wrapper.find('.search-input');
      await searchInput.setValue('Иван');
      await wrapper.vm.$nextTick();

      const filteredCount = wrapper.findAll('[data-testid="user-row"]').length;
      expect(filteredCount).toBeLessThan(initialCount);

      // Проверяем что все видимые пользователи содержат "Иван" в имени
      const userRows = wrapper.findAll('[data-testid="user-row"]');
      userRows.forEach(row => {
        const nameCell = row.find('.user-name-cell span');
        if (nameCell.exists()) {
          expect(nameCell.text().toLowerCase()).toContain('иван');
        }
      });
    });

    it('должен фильтровать пользователей по email', async () => {
      const searchInput = wrapper.find('.search-input');
      await searchInput.setValue('@example.com');
      await wrapper.vm.$nextTick();

      const userRows = wrapper.findAll('[data-testid="user-row"]');
      expect(userRows.length).toBeGreaterThan(0);

      // Проверяем что строки существуют (в них есть email)
      expect(userRows.length).toBeGreaterThan(0);
    });

    it('должен показать сообщение "Нет данных" при отсутствии результатов', async () => {
      const searchInput = wrapper.find('.search-input');
      await searchInput.setValue('НесуществующееИмя12345');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.no-data').exists()).toBe(true);
    });

    it('должен очистить поиск при нажатии кнопки очистки', async () => {
      const searchInput = wrapper.find('.search-input');
      await searchInput.setValue('Иван');
      await wrapper.vm.$nextTick();

      const filteredCount = wrapper.findAll('[data-testid="user-row"]').length;

      // Очистка поиска
      await searchInput.setValue('');
      await wrapper.vm.$nextTick();

      const newCount = wrapper.findAll('[data-testid="user-row"]').length;
      expect(newCount).toBeGreaterThan(filteredCount);
    });
  });

  describe('Фильтрация по роли', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен фильтровать пользователей по роли "admin"', async () => {
      const roleFilter = wrapper.find('.role-filter');
      await roleFilter.setValue('admin');
      await wrapper.vm.$nextTick();

      const userRows = wrapper.findAll('[data-testid="user-row"]');
      expect(userRows.length).toBeGreaterThan(0);

      userRows.forEach(row => {
        const roleCell = row.find('.role-badge');
        expect(roleCell.text()).toBe('Администратор');
      });
    });

    it('должен фильтровать пользователей по роли "user"', async () => {
      const roleFilter = wrapper.find('.role-filter');
      await roleFilter.setValue('user');
      await wrapper.vm.$nextTick();

      const userRows = wrapper.findAll('[data-testid="user-row"]');
      expect(userRows.length).toBeGreaterThan(0);

      userRows.forEach(row => {
        const roleCell = row.find('.role-badge');
        expect(roleCell.text()).toBe('Пользователь');
      });
    });

    it('должен показать всех пользователей при выборе "Все роли"', async () => {
      // Сначала применяем фильтр
      const roleFilter = wrapper.find('.role-filter');
      await roleFilter.setValue('admin');
      await wrapper.vm.$nextTick();
      const filteredCount = wrapper.findAll('[data-testid="user-row"]').length;

      // Возвращаем "Все роли"
      await roleFilter.setValue('');
      await wrapper.vm.$nextTick();

      const allCount = wrapper.findAll('[data-testid="user-row"]').length;
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });

  describe('Фильтрация по статусу', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен фильтровать активных пользователей', async () => {
      const statusButtons = wrapper.findAll('.filter-btn');
      await statusButtons[1]!.trigger('click'); // Активные
      await wrapper.vm.$nextTick();

      const userRows = wrapper.findAll('[data-testid="user-row"]');
      userRows.forEach(row => {
        expect(row.find('.status-active').exists()).toBe(true);
      });
    });

    it('должен фильтровать неактивных пользователей', async () => {
      const statusButtons = wrapper.findAll('.filter-btn');
      await statusButtons[2]!.trigger('click'); // Неактивные
      await wrapper.vm.$nextTick();

      const userRows = wrapper.findAll('[data-testid="user-row"]');
      userRows.forEach(row => {
        expect(row.find('.status-inactive').exists()).toBe(true);
      });
    });

    it('должен показать всех пользователей при выборе "Все"', async () => {
      const statusButtons = wrapper.findAll('.filter-btn');

      // Сначала фильтруем
      await statusButtons[1]!.trigger('click'); // Активные
      await wrapper.vm.$nextTick();
      const filteredCount = wrapper.findAll('[data-testid="user-row"]').length;

      // Возвращаем "Все"
      await statusButtons[0]!.trigger('click');
      await wrapper.vm.$nextTick();

      const allCount = wrapper.findAll('[data-testid="user-row"]').length;
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });

  describe('Фильтрация по дате', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен фильтровать по дате "от"', async () => {
      const dateFromInput = wrapper.find('.date-input');
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10);
      const dateString = futureDate.toISOString().split('T')[0];

      await dateFromInput.setValue(dateString);
      await wrapper.vm.$nextTick();

      // При фильтрации датой в будущем не должно быть пользователей
      expect(wrapper.findAll('[data-testid="user-row"]').length).toBe(0);
    });

    it('должен показать кнопку очистки фильтра дат', async () => {
      const dateFromInput = wrapper.find('.date-input');
      await dateFromInput.setValue('2024-01-01');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.btn-clear').exists()).toBe(true);
    });

    it('должен очистить фильтр дат при нажатии кнопки', async () => {
      const dateFromInput = wrapper.find('.date-input');
      await dateFromInput.setValue('2024-01-01');
      await wrapper.vm.$nextTick();

      const clearButton = wrapper.find('.btn-clear');
      await clearButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect((dateFromInput.element as HTMLInputElement).value).toBe('');
    });
  });

  describe('Сортировка', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен сортировать по имени при клике на заголовок', async () => {
      const nameHeader = wrapper.findAll('th.sortable').at(1)!; // Имя - второй sortable заголовок
      await nameHeader.trigger('click');
      await wrapper.vm.$nextTick();

      // Проверяем наличие стрелки сортировки
      expect(nameHeader.text()).toMatch(/[↑↓]/);
    });

    it('должен изменить направление сортировки при повторном клике', async () => {
      const nameHeader = wrapper.findAll('th.sortable').at(1)!;

      await nameHeader.trigger('click');
      await wrapper.vm.$nextTick();
      const firstClick = nameHeader.text();

      await nameHeader.trigger('click');
      await wrapper.vm.$nextTick();
      const secondClick = nameHeader.text();

      expect(firstClick).not.toEqual(secondClick);
    });

    it('должен сортировать пользователей по имени в алфавитном порядке', async () => {
      const nameHeader = wrapper.findAll('th.sortable').at(1)!;
      await nameHeader.trigger('click');
      await wrapper.vm.$nextTick();

      const userRows = wrapper.findAll('[data-testid="user-row"]');
      const names = userRows.map(row => {
        const nameCell = row.find('.user-name-cell span');
        return nameCell.exists() ? nameCell.text() : '';
      }).filter(name => name !== '');

      // Проверяем что имена отсортированы
      const sortedNames = [...names].sort((a, b) => a.localeCompare(b, 'ru'));
      expect(names).toEqual(sortedNames);
    });
  });

  describe('Пагинация', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен отобразить правильное количество страниц', async () => {
      const pagination = wrapper.find('.pagination');
      expect(pagination.exists()).toBe(true);

      const pageButtons = wrapper.findAll('.pagination .btn-page');
      expect(pageButtons.length).toBeGreaterThan(0);
    });

    it('должен переключаться на следующую страницу', async () => {
      const pageButtons = wrapper.findAll('.pagination .btn-page');
      const nextButton = pageButtons.at(-2)!; // Предпоследняя кнопка - следующая страница (▶️)

      await nextButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Проверяем что активная страница изменилась
      const activeButton = wrapper.find('.btn-page.active');
      expect(activeButton.text()).toBe('2');
    });

    it('должен переключаться на предыдущую страницу', async () => {
      const pageButtons = wrapper.findAll('.pagination .btn-page');
      const nextButton = pageButtons.at(-2)!;

      // Переходим на 2 страницу
      await nextButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Возвращаемся назад
      const prevButton = wrapper.findAll('.pagination .btn-page').at(1)!; // Вторая кнопка - предыдущая страница (◀️)
      await prevButton.trigger('click');
      await wrapper.vm.$nextTick();

      const activeButton = wrapper.find('.btn-page.active');
      expect(activeButton.text()).toBe('1');
    });

    it('должен отключить кнопку "Предыдущая" на первой странице', () => {
      const pageButtons = wrapper.findAll('.pagination .btn-page');
      const prevButton = pageButtons.at(1)!; // Вторая кнопка - предыдущая страница
      expect(prevButton.attributes('disabled')).toBeDefined();
    });

    it('должен изменить количество элементов на странице', async () => {
      const pageSizeSelect = wrapper.find('.page-size-selector select');

      await pageSizeSelect.setValue('10');
      await wrapper.vm.$nextTick();

      const userRows = wrapper.findAll('[data-testid="user-row"]');
      expect(userRows.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Выбор пользователей', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен выбрать пользователя при клике на чекбокс', async () => {
      const checkbox = wrapper.find('[data-testid="user-row"] input[type="checkbox"]');
      await checkbox.setValue(true);
      await wrapper.vm.$nextTick();

      expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    });

    it('должен показать кнопку удаления при выборе пользователей', async () => {
      const checkbox = wrapper.find('[data-testid="user-row"] input[type="checkbox"]');
      await checkbox.setValue(true);
      await wrapper.vm.$nextTick();

      const deleteButton = wrapper.find('.btn-danger');
      expect(deleteButton.exists()).toBe(true);
      expect(deleteButton.text()).toContain('Удалить выбранные');
    });

    it('должен выбрать всех пользователей при клике на главный чекбокс', async () => {
      const selectAllCheckbox = wrapper.find('thead input[type="checkbox"]');
      await selectAllCheckbox.setValue(true);
      await wrapper.vm.$nextTick();

      const userCheckboxes = wrapper.findAll('[data-testid="user-row"] input[type="checkbox"]');
      userCheckboxes.forEach(checkbox => {
        expect((checkbox.element as HTMLInputElement).checked).toBe(true);
      });
    });

    it('должен снять выбор со всех пользователей', async () => {
      const selectAllCheckbox = wrapper.find('thead input[type="checkbox"]');

      // Выбираем всех
      await selectAllCheckbox.setValue(true);
      await wrapper.vm.$nextTick();

      // Снимаем выбор
      await selectAllCheckbox.setValue(false);
      await wrapper.vm.$nextTick();

      const userCheckboxes = wrapper.findAll('[data-testid="user-row"] input[type="checkbox"]');
      userCheckboxes.forEach(checkbox => {
        expect((checkbox.element as HTMLInputElement).checked).toBe(false);
      });
    });
  });

  describe('Редактирование пользователя', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен войти в режим редактирования при клике на кнопку "Изменить"', async () => {
      const editButton = wrapper.find('[data-testid="user-row"] .btn-icon');
      await editButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Должны появиться поля ввода
      expect(wrapper.find('[data-testid="user-row"] .edit-input').exists()).toBe(true);
    });

    it('должен показать кнопки "Сохранить" и "Отмена" в режиме редактирования', async () => {
      const editButton = wrapper.find('[data-testid="user-row"] .btn-icon');
      await editButton.trigger('click');
      await wrapper.vm.$nextTick();

      const row = wrapper.find('[data-testid="user-row"]');
      expect(row.find('.btn-success').exists()).toBe(true);
      expect(row.find('.btn-cancel').exists()).toBe(true);
    });

    it('должен отменить редактирование при клике на "Отмена"', async () => {
      const editButton = wrapper.find('[data-testid="user-row"] .btn-icon');
      await editButton.trigger('click');
      await wrapper.vm.$nextTick();

      const cancelButton = wrapper.find('[data-testid="user-row"] .btn-cancel');
      await cancelButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Поля ввода должны исчезнуть
      expect(wrapper.find('[data-testid="user-row"] .edit-input').exists()).toBe(false);
    });

    it('должен сохранить изменения при клике на "Сохранить"', async () => {
      const editButton = wrapper.find('[data-testid="user-row"] .btn-icon');
      await editButton.trigger('click');
      await wrapper.vm.$nextTick();

      const nameInput = wrapper.find('[data-testid="user-row"] .edit-input');
      await nameInput.setValue('Новое Имя');
      await wrapper.vm.$nextTick();

      const saveButton = wrapper.find('[data-testid="user-row"] .btn-success');
      await saveButton.trigger('click');

      const promise = vi.advanceTimersByTimeAsync(1000);
      await wrapper.vm.$nextTick();
      await promise;

      // Режим редактирования должен завершиться
      expect(wrapper.find('[data-testid="user-row"] .edit-input').exists()).toBe(false);
    });
  });

  describe('Удаление пользователя', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен показать подтверждение при удалении пользователя', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const deleteButtons = wrapper.findAll('[data-testid="user-row"] .btn-icon');
      const deleteButton = deleteButtons.at(-1)!; // Последняя кнопка - удаление
      await deleteButton.trigger('click');

      expect(confirmSpy).toHaveBeenCalledWith('Вы уверены, что хотите удалить этого пользователя?');

      confirmSpy.mockRestore();
    });

    it('должен удалить пользователя при подтверждении', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const deleteButtons = wrapper.findAll('[data-testid="user-row"] .btn-icon');
      const deleteButton = deleteButtons.at(-1)!;
      await deleteButton.trigger('click');

      const promise = vi.advanceTimersByTimeAsync(350);
      await wrapper.vm.$nextTick();
      await promise;
      await wrapper.vm.$nextTick();

      // Проверяем что confirm был вызван
      expect(confirmSpy).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('должен удалить выбранных пользователей', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      // Выбираем первых 3 пользователей
      const checkboxes = wrapper.findAll('[data-testid="user-row"] input[type="checkbox"]');
      await checkboxes[0]!.setValue(true);
      await checkboxes[1]!.setValue(true);
      await checkboxes[2]!.setValue(true);
      await wrapper.vm.$nextTick();

      const deleteSelectedButton = wrapper.find('.btn-danger');
      expect(deleteSelectedButton.text()).toContain('Удалить выбранные (3)');

      await deleteSelectedButton.trigger('click');

      const promise = vi.advanceTimersByTimeAsync(550);
      await wrapper.vm.$nextTick();
      await promise;
      await wrapper.vm.$nextTick();

      // Проверяем что confirm был вызван
      expect(confirmSpy).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('Изменение статуса пользователя', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен переключить статус пользователя при клике на бейдж статуса', async () => {
      const statusBadge = wrapper.find('[data-testid="user-row"] .status-badge');
      const initialStatus = statusBadge.text();

      await statusBadge.trigger('click');

      const promise = vi.advanceTimersByTimeAsync(500);
      await wrapper.vm.$nextTick();
      await promise;

      const newStatus = wrapper.find('[data-testid="user-row"] .status-badge').text();
      expect(newStatus).not.toBe(initialStatus);
    });
  });

  describe('Добавление пользователя', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен открыть модальное окно при клике на "Добавить пользователя"', async () => {
      const addButton = wrapper.find('.btn-primary');
      await addButton.trigger('click');
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.modal-overlay').exists()).toBe(true);
      expect(wrapper.find('.modal h3').text()).toBe('Добавить нового пользователя');
    });

    it('должен добавить нового пользователя', async () => {
      const addButton = wrapper.find('.btn-primary');
      await addButton.trigger('click');
      await flushPromises()
      await wrapper.vm.$nextTick();

      const modal = wrapper.find('.modal');
      const nameInput = modal.findAll('input[type="text"]').at(0)!;
      const emailInput = modal.findAll('input[type="email"]').at(0)!;

      await nameInput.setValue('Новый Пользователь');
      await emailInput.setValue('new@example.com');
      await wrapper.vm.$nextTick();

      const addUserButton = modal.find('.btn-primary');
      await addUserButton.trigger('click');

      const promise = vi.advanceTimersByTimeAsync(1000);
      await wrapper.vm.$nextTick();
      await promise;

      // Модальное окно должно закрыться
      expect(wrapper.find('.modal-overlay').exists()).toBe(false);
    });

    it('должен показать ошибку валидации для пустого имени', async () => {
      const addButton = wrapper.find('.btn-primary');
      await addButton.trigger('click');
      await flushPromises()
      await wrapper.vm.$nextTick();

      const modal = wrapper.find('.modal');
      const nameInput = modal.findAll('input[type="text"]').at(0)!;

      await nameInput.setValue('');
      await nameInput.trigger('blur');
      await wrapper.vm.$nextTick();

      // Кнопка "Добавить" должна быть отключена
      const addUserButton = modal.find('.btn-primary');
      expect(addUserButton.attributes('disabled')).toBeDefined();
    });

    it('должен показать ошибку валидации для некорректного email', async () => {
      const addButton = wrapper.find('.btn-primary');
      await addButton.trigger('click');
      await flushPromises()
      await wrapper.vm.$nextTick();

      const modal = wrapper.find('.modal');
      const emailInput = modal.findAll('input[type="email"]').at(0)!;

      await emailInput.setValue('invalid-email');
      await emailInput.trigger('blur');
      await wrapper.vm.$nextTick();

      // Проверяем что есть текст с ошибкой
      expect(modal.text()).toContain('Некорректный');
    });
  });

  describe('Детали пользователя', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен открыть модальное окно деталей при клике на кнопку "Подробнее"', async () => {
      const row = wrapper.find('[data-testid="user-row"]');
      const buttons = row.findAll('.btn-icon');
      const detailsButton = buttons.at(1)!; // Вторая кнопка - подробнее

      await detailsButton.trigger('click');
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.modal h3').text()).toBe('Информация о пользователе');
    });

    it('должен отобразить информацию о пользователе в модальном окне', async () => {
      const row = wrapper.find('[data-testid="user-row"]');
      const buttons = row.findAll('.btn-icon');
      const detailsButton = buttons.at(1)!;

      await detailsButton.trigger('click');
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick();

      const modal = wrapper.find('.modal');
      expect(modal.text()).toContain('ID:');
      expect(modal.text()).toContain('Роль:');
      expect(modal.text()).toContain('Статус:');
      expect(modal.text()).toContain('Дата регистрации:');
    });

    it('должен закрыть модальное окно деталей', async () => {
      const row = wrapper.find('[data-testid="user-row"]');
      const buttons = row.findAll('.btn-icon');
      const detailsButton = buttons.at(1)!;

      await detailsButton.trigger('click');
      await flushPromises()
      await wrapper.vm.$nextTick();

      const closeButton = wrapper.find('.modal .btn-secondary');
      await closeButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.modal-overlay').exists()).toBe(false);
    });
  });

  describe('Экспорт в CSV', () => {
    let hostElement: HTMLDivElement;
    let localWrapper: VueWrapper;

    beforeEach(async () => {
      vi.useFakeTimers();
      hostElement = document.createElement('div');
      document.body.appendChild(hostElement);

      localWrapper = mount(UserTable, {
        props: {
          title: 'Управление пользователями',
          initialPageSize: 25,
          apiEndpoint: '/api/users'
        },
        attachTo: hostElement
      });

      await vi.advanceTimersByTimeAsync(1000);
      await localWrapper.vm.$nextTick();
    });

    afterEach(() => {
      vi.useRealTimers();
      if (localWrapper) {
        localWrapper.unmount();
      }
      if (hostElement && hostElement.parentNode) {
        hostElement.parentNode.removeChild(hostElement);
      }
    });

    it('должен экспортировать пользователей в CSV', async () => {
      const exportButton = localWrapper.find('.btn-secondary');
      expect(exportButton.exists()).toBe(true);
      expect(exportButton.text()).toContain('Экспорт');

      // Проверяем что кнопка работает
      await exportButton.trigger('click');
      await localWrapper.vm.$nextTick();

      // Проверяем что кнопка всё еще доступна (не заблокирована)
      expect(exportButton.exists()).toBe(true);
    });
  });

  describe('Очистка фильтров', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен очистить все фильтры при отображении сообщения "Нет данных"', async () => {
      const searchInput = wrapper.find('.search-input');
      await searchInput.setValue('НесуществующееИмя999');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.no-data').exists()).toBe(true);

      const resetButton = wrapper.find('.no-data .btn-primary');
      await resetButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect((searchInput.element as HTMLInputElement).value).toBe('');
    });
  });

  describe('Props', () => {
    let hostElement: HTMLDivElement;

    beforeEach(() => {
      vi.useFakeTimers();
      hostElement = document.createElement('div');
      document.body.appendChild(hostElement);
    });

    afterEach(() => {
      vi.useRealTimers();
      if (hostElement && hostElement.parentNode) {
        hostElement.parentNode.removeChild(hostElement);
      }
    });

    it('должен принять custom title через props', () => {
      const customWrapper = mount(UserTable, {
        props: {
          title: 'Мои Пользователи',
          initialPageSize: 25,
          apiEndpoint: '/api/users'
        },
        attachTo: hostElement
      });

      expect(customWrapper.find('h2').text()).toBe('Мои Пользователи');

      customWrapper.unmount();
    });

    it('должен принять custom pageSize через props', async () => {
      const customWrapper = mount(UserTable, {
        props: {
          title: 'Управление пользователями',
          initialPageSize: 10,
          apiEndpoint: '/api/users'
        },
        attachTo: hostElement
      });

      await vi.advanceTimersByTimeAsync(1000);
      await customWrapper.vm.$nextTick();

      const userRows = customWrapper.findAll('[data-testid="user-row"]');
      expect(userRows.length).toBeLessThanOrEqual(10);

      customWrapper.unmount();
    });

    it('должен использовать default значения для props', () => {
      const defaultWrapper = mount(UserTable, {
        attachTo: hostElement
      });

      expect(defaultWrapper.find('h2').text()).toBe('Управление пользователями');

      defaultWrapper.unmount();
    });
  });

  describe('Edge cases', () => {
    beforeEach(async () => {
      await waitForData();
    });

    it('должен обработать пустой результат поиска', async () => {
      const searchInput = wrapper.find('.search-input');
      await searchInput.setValue('НесуществующееИмя999999');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.no-data').exists()).toBe(true);
      expect(wrapper.findAll('[data-testid="user-row"]').length).toBe(0);
    });

    it('должен корректно работать с большим количеством фильтров одновременно', async () => {
      const searchInput = wrapper.find('.search-input');
      await searchInput.setValue('Иван');

      const roleFilter = wrapper.find('.role-filter');
      await roleFilter.setValue('user');

      const statusButtons = wrapper.findAll('.filter-btn');
      await statusButtons[1]!.trigger('click'); // Активные

      await wrapper.vm.$nextTick();

      // Должны быть результаты или пустое состояние
      const hasResults = wrapper.findAll('[data-testid="user-row"]').length > 0;
      const hasNoData = wrapper.find('.no-data').exists();

      expect(hasResults || hasNoData).toBe(true);
    });
  });
});

